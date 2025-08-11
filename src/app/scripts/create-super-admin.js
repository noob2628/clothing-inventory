// src/app/scripts/create-super-admin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createSuperAdmin() {
  const username = 'superadmin';
  const password = 'Temp123*';
  const role = 'SUPER_ADMIN';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const client = await pool.connect();
    const res = await client.query(
      `INSERT INTO users (username, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, role`,
      [username, hashedPassword, role]
    );
    
    console.log('SUPER_ADMIN created:', res.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error creating SUPER_ADMIN:', error);
  } finally {
    await pool.end();
  }
}

createSuperAdmin();