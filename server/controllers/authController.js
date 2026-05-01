import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Derive aadhar_id: SHA-256 hash of the raw 12-digit Aadhar number
const hashAadhar = (raw) =>
  crypto.createHash('sha256').update(raw.trim()).digest('hex');

// Map login-form display names → DB ENUM values
const ROLE_MAP = {
  'Civilian / Victim':        'citizen',
  'First Responder':          'responder',
  'Hospital representative':  'hospital',
  'admin':                    'admin',
};
const mapRole = (role) => ROLE_MAP[role] || 'citizen';

// ─── REGISTER ────────────────────────────────────────────────
export const register = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { full_name, email, aadhar, phone_number, password, role } = req.body;

    if (!full_name || !email || !aadhar || !phone_number || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^\d{12}$/.test(aadhar.trim())) {
      return res.status(400).json({ error: 'Aadhar must be exactly 12 digits.' });
    }

    const aadhar_id = hashAadhar(aadhar);

    // Check for existing user (by email OR aadhar_id)
    const [existing] = await conn.execute(
      'SELECT aadhar_id FROM users WHERE aadhar_id = ? OR email = ? LIMIT 1',
      [aadhar_id, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or Aadhar already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userRole = mapRole(role);

    await conn.execute(
      `INSERT INTO users (aadhar_id, full_name, email, phone_number, password_hash, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [aadhar_id, full_name, email, phone_number, password_hash, userRole]
    );

    const token = jwt.sign(
      { aadhar_id, role: userRole },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { aadhar_id, name: full_name, email, role: userRole },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ─── LOGIN ───────────────────────────────────────────────────
export const login = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { name, aadhar, password, role } = req.body;

    if (!name || !aadhar || !password || !role) {
      return res.status(400).json({ error: 'Name, Aadhar, role and password are required.' });
    }
    if (!/^\d{12}$/.test(aadhar.trim())) {
      return res.status(400).json({ error: 'Aadhar must be exactly 12 digits.' });
    }

    const aadhar_id = hashAadhar(aadhar);

    // Match both name AND aadhar_id
    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE full_name = ? AND aadhar_id = ? AND is_active = 1 LIMIT 1',
      [name, aadhar_id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Verify submitted role matches the account's stored role
    const submittedRole = mapRole(role);
    if (user.role !== submittedRole) {
      return res.status(403).json({ error: `This account is not registered as "${role}". Please select the correct role.` });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { aadhar_id: user.aadhar_id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        aadhar_id: user.aadhar_id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
