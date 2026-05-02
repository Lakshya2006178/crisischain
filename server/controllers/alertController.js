import crypto from 'crypto';
import pool from '../db.js';

const uuid = () => crypto.randomUUID();

// Map form type strings to existing incident_type rows (case-insensitive partial match)
const resolveTypeId = async (conn, typeName) => {
  if (!typeName) return 1; // Default: Fire fallback
  const [rows] = await conn.execute(
    'SELECT type_id FROM incident_type WHERE LOWER(type_name) LIKE ? LIMIT 1',
    [`%${typeName.toLowerCase()}%`]
  );
  if (rows.length > 0) return rows[0].type_id;

  // Fallback mapping for common form values
  const map = {
    flood: 2, cyclone: 5, wildfire: 1, earthquake: 5,
    collapse: 6, chemical: 7, hazmat: 7, medical: 3, accident: 4, other: 4,
  };
  return map[typeName.toLowerCase()] || 4;
};

// Map form severity strings → DB ENUM values
const mapSeverity = (s) => {
  if (!s) return 'Medium';
  const l = s.toLowerCase();
  if (l === 'critical') return 'Critical';
  if (l === 'high')     return 'High';
  if (l === 'medium' || l === 'moderate') return 'Medium';
  return 'Low';
};

// Convert DB row into the shape the Alerts.jsx frontend expects
const formatIncident = (row) => {
  const typeIconMap = {
    Fire: 'Flame', Flood: 'Droplets', 'Medical Emergency': 'HeartPulse',
    'Road Accident': 'AlertTriangle', 'Natural Disaster': 'Wind',
    'Structural Collapse': 'Shield', 'Hazardous Material': 'Radiation',
  };
  const severityColor = { Critical: '#ef4444', High: '#ef4444', Medium: '#f59e0b', Low: '#3b82f6' };

  return {
    id:          row.incident_id,
    incident_id: row.incident_id,
    type:        row.type_name,
    title:       `${row.type_name} — ${row.location_text || 'Unknown Location'}`,
    location:    row.location_text || `${row.latitude}, ${row.longitude}`,
    severity:    row.priority_level,
    status:      row.incident_status,
    description: row.description || '',
    time:        formatRelativeTime(row.created_at),
    timestamp:   row.created_at,
    iconName:    row.icon_name || typeIconMap[row.type_name] || 'AlertTriangle',
    color:       severityColor[row.priority_level] || '#f59e0b',
    coordinates: row.latitude ? `${row.latitude}, ${row.longitude}` : 'N/A',
    resources:   'Dispatch Pending',
  };
};

const formatRelativeTime = (ts) => {
  if (!ts) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

// ─── CREATE INCIDENT ─────────────────────────────────────────
export const createAlert = async (req, res) => {
  const conn = await pool.getConnection();
  try {
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

    const reporterId = aadhar_id || req.user?.aadhar_id || null;

    // Resolve type_id: use supplied int, or look up by name
    const type_id = rawTypeId
      ? parseInt(rawTypeId)
      : await resolveTypeId(conn, type);

    const priority = priority_level || mapSeverity(severity);
    const incident_id = uuid();

    await conn.execute(
      `INSERT INTO incident
         (incident_id, aadhar_id, type_id, description, location_text, latitude, longitude, priority_level)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incident_id,
        reporterId,
        type_id,
        description || null,
        location    || null,
        latitude    || null,
        longitude   || null,
        priority,
      ]
    );

    // Immutable audit log entry
    await conn.execute(
      `INSERT INTO incident_report_log (log_id, incident_id, log_type, new_value, notes, is_system)
       VALUES (?, ?, 'SystemEvent', 'Reported', 'Incident created via report form.', 1)`,
      [uuid(), incident_id]
    );

    const [[incident]] = await conn.execute(
      `SELECT i.*, it.type_name, it.icon_name
       FROM incident i
       JOIN incident_type it ON i.type_id = it.type_id
       WHERE i.incident_id = ?`,
      [incident_id]
    );

    res.status(201).json(formatIncident(incident));
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
    res.json(rows.map(formatIncident));
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
