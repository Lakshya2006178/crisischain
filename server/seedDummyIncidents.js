import crypto from 'crypto';
import pool from './db.js';

// Dummy Incidents
const dummyIncidents = [
  { type: 1, desc: 'Major structure fire at downtown block', loc: '123 Main St, Mangaluru', lat: 12.8719, lng: 74.8422, status: 'Reported', severity: 'High' },
  { type: 4, desc: 'Multiple vehicle collision on highway', loc: 'NH-66, near Pumpwell', lat: 12.8593, lng: 74.8550, status: 'InProgress', severity: 'Critical' },
  { type: 3, desc: 'Mass casualty medical emergency', loc: 'KMC Hospital area', lat: 12.8644, lng: 74.8432, status: 'Assigned', severity: 'Critical' },
  { type: 2, desc: 'Severe flash flood due to heavy rains', loc: 'Lower Bendoorwell', lat: 12.8710, lng: 74.8560, status: 'Reported', severity: 'Medium' },
  { type: 7, desc: 'Chemical spill at industrial estate', loc: 'Baikampady Industrial Estate', lat: 12.9340, lng: 74.8142, status: 'InProgress', severity: 'Critical' },
  { type: 6, desc: 'Old building collapse', loc: 'Bunder area', lat: 12.8655, lng: 74.8360, status: 'Resolved', severity: 'Medium' },
  { type: 5, desc: 'Cyclone alert and high winds', loc: 'Panambur Beach', lat: 12.9141, lng: 74.8105, status: 'Reported', severity: 'Medium' }
];

// Dummy Resource Centers
const dummyCenters = [
  { id: crypto.randomUUID(), name: "KMC Hospital Mangaluru", type: "Hospital", lat: 12.864500, lng: 74.843200, address: "Ambedkar Circle, Mangaluru", phone: "08242225533" },
  { id: crypto.randomUUID(), name: "Nitte Gajria Hospital", type: "Hospital", lat: 13.225700, lng: 75.013300, address: "Karkala Road, Udupi", phone: "08202524820" },
  { id: crypto.randomUUID(), name: "Government Hospital Mangaluru", type: "Hospital", lat: 12.867800, lng: 74.843000, address: "Lalbagh, Mangaluru", phone: "08242220223" },
  { id: crypto.randomUUID(), name: "Dr.T.M.A. Pai Rotary Hospital", type: "Hospital", lat: 13.223500, lng: 74.977400, address: "Manipal, Udupi", phone: "08202922217" },
  { id: crypto.randomUUID(), name: "Father Muller Medical College", type: "Hospital", lat: 12.914100, lng: 74.856000, address: "Kankanady, Mangaluru", phone: "08242238000" },
  { id: crypto.randomUUID(), name: "Mangaluru Fire Station", type: "FireStation", lat: 12.871900, lng: 74.842200, address: "Hampankatta, Mangaluru", phone: "08242231414" },
  { id: crypto.randomUUID(), name: "Mangaluru City Police HQ", type: "Police", lat: 12.866600, lng: 74.843800, address: "Balmatta, Mangaluru", phone: "08242220600" }
];

// Dummy Resources
const resourceTypes = ["ICU Beds", "General Beds", "Ventilators", "Ambulances"];

async function seed() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to Database. Starting seed process...');
    
    // Disable foreign key checks to safely clear tables
    console.log('Clearing old dummy data...');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate relevant tables
    await conn.execute('TRUNCATE TABLE incident_report_log');
    await conn.execute('TRUNCATE TABLE incident');
    await conn.execute('TRUNCATE TABLE resource');
    await conn.execute('TRUNCATE TABLE resource_center');
    
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    // 1. Seed Resource Centers & Resources
    console.log('Seeding resource centers and resources...');
    for (const center of dummyCenters) {
      await conn.execute(
        `INSERT INTO resource_center (center_id, name, center_type, latitude, longitude, address, contact_number)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [center.id, center.name, center.type, center.lat, center.lng, center.address, center.phone]
      );
      
      // Seed randomized resources for each center
      for (const resType of resourceTypes) {
        let maxQty = resType.includes('Beds') ? 50 : 10;
        if (center.type !== 'Hospital' && resType.includes('Beds')) continue;
        
        const qty = Math.floor(Math.random() * maxQty);
        await conn.execute(
          `INSERT INTO resource (resource_id, center_id, resource_type, quantity_available)
           VALUES (?, ?, ?, ?)`,
          [crypto.randomUUID(), center.id, resType, qty]
        );
      }
    }
    
    // 2. Seed Admin User
    console.log('Seeding Admin User...');
    await conn.execute(
      `INSERT IGNORE INTO users (aadhar_id, full_name, email, phone_number, password_hash, role, is_verified) 
       VALUES ('f7b11509f4d675c3c44f0dd37ca830bb02e8cfa58f04c46283c4bfcbdce1ff45', 'ADMIN_USERNAME', 'admin@crisischain.com', '0000000000', '$2a$10$B4OXDSqG1AWH5/WKI5GYfe62cqrAzO7rfkftUFYoNhvwPnktp26/y', 'admin', 1)`
    );
    
    // 3. Seed Incidents
    console.log('Seeding incidents and audit logs...');
    for (const inc of dummyIncidents) {
      const id = crypto.randomUUID();
      await conn.execute(
        `INSERT INTO incident (incident_id, type_id, description, location_text, latitude, longitude, incident_status, priority_level)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, inc.type, inc.desc, inc.loc, inc.lat, inc.lng, inc.status, inc.severity]
      );
      
      // Seed audit log
      await conn.execute(
        `INSERT INTO incident_report_log (log_id, incident_id, log_type, new_value, notes, is_system)
         VALUES (?, ?, 'SystemEvent', 'Reported', 'Dummy data automatically seeded', 1)`,
        [crypto.randomUUID(), id]
      );
    }
    
    console.log(`\n✅ Seeding Complete!`);
    console.log(`Inserted ${dummyCenters.length} Resource Centers.`);
    console.log(`Inserted random resources for each center.`);
    console.log(`Inserted ${dummyIncidents.length} Incidents with Audit Logs.`);

  } catch (err) {
    console.error('❌ Failed to seed the database:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

seed();
