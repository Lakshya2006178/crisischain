import crypto from 'crypto';
import pool from '../db.js';

const uuid = () => crypto.randomUUID();

// Ensure an incident_type row exists for the given name and return its type_id
const getOrCreateTypeId = async (conn, typeName) => {
  const name = (typeName || 'other').toLowerCase();
  const [rows] = await conn.execute(
    'SELECT type_id FROM incident_type WHERE LOWER(type_name) = ? LIMIT 1', [name]
  );
  if (rows.length > 0) return rows[0].type_id;

  // Create it on the fly
  const type_id = uuid();
  await conn.execute(
    'INSERT INTO incident_type (type_id, type_name, icon_name) VALUES (?, ?, ?)',
    [type_id, typeName, 'AlertTriangle']
  );
  return type_id;
};

// Map form severity strings to DB ENUM values
const mapSeverity = (s) => {
  if (!s) return 'Medium';
  const l = s.toLowerCase();
  if (l === 'critical' || l === 'high') return 'High';
  if (l === 'medium' || l === 'moderate') return 'Medium';
  return 'Low';
};

// ─── CREATE INCIDENT ─────────────────────────────────────────
export const createAlert = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    // Accept either the old schema (type_id, latitude, longitude)
    // OR the form schema (type, location, severity, description)
    const {
      aadhar_id,
      type_id: rawTypeId,
      type,
      location,
      description,
      severity,
      priority_level,
      latitude,
      longitude,
    } = req.body;

    // Resolve reporter — use aadhar_id from body, or from JWT token
    const reporterId = aadhar_id || req.user?.aadhar_id || null;

    // Resolve type_id
    let type_id = rawTypeId;
    if (!type_id) {
      type_id = await getOrCreateTypeId(conn, type || 'Other');
    }

    const incident_id = uuid();
    const priority = priority_level || mapSeverity(severity);

    await conn.execute(
      `INSERT INTO incident
         (incident_id, aadhar_id, type_id, description, location_text, latitude, longitude, priority_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incident_id,
        reporterId,
        type_id,
        description || null,
        location || null,
        latitude  || null,
        longitude || null,
        priority,
      ]
    );

    // Append to the immutable report log
    await conn.execute(
      `INSERT INTO incident_report_log (log_id, incident_id, log_type, new_value, notes, is_system)
       VALUES (?, ?, 'SystemEvent', 'Reported', 'Incident created.', 1)`,
      [uuid(), incident_id]
    );

    // Return the full row with type info for the frontend
    const [[incident]] = await conn.execute(
      `SELECT i.*, it.type_name, it.icon_name
       FROM incident i
       JOIN incident_type it ON i.type_id = it.type_id
       WHERE i.incident_id = ?`,
      [incident_id]
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
