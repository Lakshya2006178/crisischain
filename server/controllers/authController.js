import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, aadhar, password, role } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { aadhar }] });
    if (existing) return res.status(400).json({ error: "Email or Aadhar already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, aadhar, password: hashedPassword, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123');
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, aadhar, password } = req.body;
    const user = await User.findOne({ email, aadhar });
    if (!user) return res.status(404).json({ error: "User not found or credentials mismatch" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123');
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
