// src/app/api/login/route.js
import bcrypt from 'bcryptjs';
import { query } from '@/lib/database';

export async function POST(request) {
  const { username, password } = await request.json();
  
  try {
    const res = await query(
      'SELECT id, username, role, password FROM users WHERE username = $1',
      [username]
    );
    
    const user = res.rows[0];
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Remove password before returning
    const { password: _, ...safeUser } = user;
    return Response.json(safeUser);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}