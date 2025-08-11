// src/app/api/signup/route.js
import bcrypt from 'bcryptjs';
import { query } from '@/lib/database';

export async function POST(request) {
  const { username, password, role } = await request.json();
  
  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const res = await query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    );
    
    return Response.json(res.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'Username already exists' }, { status: 400 });
    }
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}