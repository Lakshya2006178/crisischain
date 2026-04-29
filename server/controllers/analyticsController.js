import pool from '../db.js';

export const getIncidentDistribution = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT it.type_name AS _id, COUNT(*) AS count
       FROM incident i
       JOIN incident_type it ON i.type_id = it.type_id
       GROUP BY it.type_name
       ORDER BY count DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

export const getResponseTrends = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT DATE(created_at) AS _id,
              ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, resolved_at)), 1) AS avgResponse
       FROM incident
       WHERE resolved_at IS NOT NULL
       GROUP BY DATE(created_at)
       ORDER BY _id ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

export const getIncidentTrends = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT DATE_FORMAT(created_at, '%H:00') AS _id, COUNT(*) AS count
       FROM incident
       GROUP BY DATE_FORMAT(created_at, '%H:00')
       ORDER BY _id ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
