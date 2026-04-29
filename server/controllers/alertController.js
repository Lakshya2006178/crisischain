import crypto from 'crypto';
import pool from '../db.js';

// Helper: generate a UUID v4
const uuid = () => crypto.randomUUID();

// ─── CREATE INCIDENT ─────────────────────────────────────────
export const createAlert = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { aadhar_id, type_id, description, latitude, longitude, priority_level } = req.body;
    if (!aadhar_id || !type_id || !latitude || !longitude) {
      return res.status(400).json({ error: 'aadhar_id, type_id, latitude and longitude are required.' });
    }

    const incident_id = uuid();
    await conn.execute(
      `INSERT INTO incident (incident_id, aadhar_id, type_id, description, latitude, longitude, priority_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [incident_id, aadhar_id, type_id, description || null, latitude, longitude, priority_level || 'Medium']
    );

    // Write to report log
    await conn.execute(
      `INSERT INTO incident_report_log (log_id, incident_id, log_type, new_value, notes, is_system)
       VALUES (?, ?, 'SystemEvent', 'Reported', 'Incident created via panic alert.', 1)`,
      [uuid(), incident_id]
    );

    const [[incident]] = await conn.execute(
      'SELECT * FROM incident WHERE incident_id = ?', [incident_id]
    );
    res.status(201).json(incident);
  } catch (err) {
    console.error('createAlert error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ─── GET ALL INCIDENTS ────────────────────────────────────────
export const getAlerts = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT i.*, it.type_name, it.icon_name
       FROM incident i
       JOIN incident_type it ON i.type_id = it.type_id
       ORDER BY i.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ─── UPDATE INCIDENT STATUS ───────────────────────────────────
export const updateAlertStatus = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { status } = req.body;
    const { id: incident_id } = req.params;

    const [[current]] = await conn.execute(
      'SELECT incident_status FROM incident WHERE incident_id = ?', [incident_id]
    );
    if (!current) return res.status(404).json({ error: 'Incident not found.' });

    const resolved_at = status === 'Resolved' ? new Date() : null;
    await conn.execute(
      `UPDATE incident SET incident_status = ?, resolved_at = COALESCE(?, resolved_at)
       WHERE incident_id = ?`,
      [status, resolved_at, incident_id]
    );

    // Log the status change
    await conn.execute(
      `INSERT INTO incident_report_log (log_id, incident_id, log_type, old_value, new_value, is_system)
       VALUES (?, ?, 'StatusChange', ?, ?, 1)`,
      [uuid(), incident_id, current.incident_status, status]
    );

    res.json({ success: true, incident_id, new_status: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ─── STATS ────────────────────────────────────────────────────
export const getStats = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [[{ total }]]    = await conn.execute('SELECT COUNT(*) AS total FROM incident');
    const [[{ active }]]   = await conn.execute("SELECT COUNT(*) AS active FROM incident WHERE incident_status NOT IN ('Resolved','Closed')");
    const [[{ resolved }]] = await conn.execute("SELECT COUNT(*) AS resolved FROM incident WHERE incident_status = 'Resolved'");
    const [[{ avg_mins }]] = await conn.execute(
      `SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, resolved_at)), 1) AS avg_mins
       FROM incident WHERE resolved_at IS NOT NULL`
    );
    res.json({ total, active, resolved, avgResponseTimeMinutes: avg_mins || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
