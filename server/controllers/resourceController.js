import pool from '../db.js';

export const getResources = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT r.*, rc.name AS center_name, rc.center_type, rc.latitude, rc.longitude
       FROM resource r
       JOIN resource_center rc ON r.center_id = rc.center_id
       ORDER BY rc.name, r.resource_type`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

export const updateResourceStatus = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { quantity_available } = req.body;
    const { id: resource_id } = req.params;

    const [[existing]] = await conn.execute(
      'SELECT resource_id FROM resource WHERE resource_id = ?', [resource_id]
    );
    if (!existing) return res.status(404).json({ error: 'Resource not found.' });

    await conn.execute(
      'UPDATE resource SET quantity_available = ? WHERE resource_id = ?',
      [quantity_available, resource_id]
    );
    res.json({ success: true, resource_id, quantity_available });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
