import crypto from 'crypto';
import pool from './db.js';

const dummyIncidents = [
  { type: 1, desc: 'Major structure fire at downtown block', loc: '123 Main St, Mangaluru', lat: 12.8719, lng: 74.8422, status: 'Reported', severity: 'High' },
  { type: 4, desc: 'Multiple vehicle collision on highway', loc: 'NH-66, near Pumpwell', lat: 12.8593, lng: 74.8550, status: 'InProgress', severity: 'Critical' },
  { type: 3, desc: 'Mass casualty medical emergency', loc: 'KMC Hospital area', lat: 12.8644, lng: 74.8432, status: 'Assigned', severity: 'Critical' },
  { type: 2, desc: 'Severe flash flood due to heavy rains', loc: 'Lower Bendoorwell', lat: 12.8710, lng: 74.8560, status: 'Reported', severity: 'Medium' },
  { type: 7, desc: 'Chemical spill at industrial estate', loc: 'Baikampady Industrial Estate', lat: 12.9340, lng: 74.8142, status: 'InProgress', severity: 'Critical' },
  { type: 6, desc: 'Old building collapse', loc: 'Bunder area', lat: 12.8655, lng: 74.8360, status: 'Resolved', severity: 'Medium' },
  { type: 5, desc: 'Cyclone alert and high winds', loc: 'Panambur Beach', lat: 12.9141, lng: 74.8105, status: 'Reported', severity: 'Medium' }
];

async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to Database. Starting seed process...');
    
    // Clear out existing incidents so it doesn't infinitely pile up when run multiple times
    console.log('Clearing old incidents...');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await conn.execute('TRUNCATE TABLE incident_report_log');
    await conn.execute('TRUNCATE TABLE incident');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Seeding new dummy incidents...');
    for (const inc of dummyIncidents) {
      const id = crypto.randomUUID();
      await conn.execute(
        `INSERT INTO incident (incident_id, type_id, description, location_text, latitude, longitude, incident_status, priority_level)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, inc.type, inc.desc, inc.loc, inc.lat, inc.lng, inc.status, inc.severity]
      );
      
      // Seed audit log to keep data relational integrity
      await conn.execute(
        `INSERT INTO incident_report_log (log_id, incident_id, log_type, new_value, notes, is_system)
         VALUES (?, ?, 'SystemEvent', 'Reported', 'Dummy data automatically seeded', 1)`,
        [crypto.randomUUID(), id]
      );
    }
    
    console.log(`Successfully seeded ${dummyIncidents.length} dummy incidents!`);
  } catch (err) {
    console.error('Failed to seed the database:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

seed();
