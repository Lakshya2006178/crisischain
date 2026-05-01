import pool from '../db.js';

// ─── GET ALL RESOURCES ────────────────────────────────────────
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

// ─── GET NEARBY RESOURCE CENTERS (Haversine distance) ────────
// GET /api/resources/nearby?lat=XX&lng=YY&radius=10&type=Hospital
export const getNearbyCenters = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { lat, lng, radius = 20, type } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required.' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Haversine formula inline in SQL — returns distance in km
    let query = `
      SELECT
        rc.center_id,
        rc.name,
        rc.center_type,
        rc.latitude,
        rc.longitude,
        rc.address,
        rc.contact_number,
        ROUND(
          6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(rc.latitude)) *
            COS(RADIANS(rc.longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(rc.latitude))
          ), 2
        ) AS distance_km,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'resource_type', r.resource_type,
            'quantity_available', r.quantity_available
          )
        ) AS resources
      FROM resource_center rc
      LEFT JOIN resource r ON r.center_id = rc.center_id
    `;

    const params = [userLat, userLng, userLat];

    if (type) {
      query += ` WHERE rc.center_type = ?`;
      params.push(type);
    }

    query += `
      GROUP BY rc.center_id
      HAVING distance_km <= ?
      ORDER BY distance_km ASC
      LIMIT 20
    `;
    params.push(radiusKm);

    const [rows] = await conn.execute(query, params);

    // Parse resources JSON string if needed
    const centers = rows.map(row => ({
      ...row,
      resources: typeof row.resources === 'string'
        ? JSON.parse(row.resources)
        : row.resources,
    }));

    res.json(centers);
  } catch (err) {
    console.error('getNearbyCenters error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ─── UPDATE RESOURCE QUANTITY ─────────────────────────────────
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
