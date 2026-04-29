import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import alertRoutes from './routes/alerts.js';
import resourceRoutes from './routes/resources.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',      authRoutes);
app.use('/api/alerts',    alertRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'CrisisChain API running', db: 'MySQL' }));

// Test DB connection then start
pool.getConnection()
  .then((conn) => {
    console.log('✅ Connected to MySQL — crisischain_db');
    conn.release();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });
