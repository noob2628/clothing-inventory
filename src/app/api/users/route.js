// src/app/api/users/route.js
import { getAllUsers } from '@/lib/server/auth';

export async function GET() {
  try {
    const users = await getAllUsers();
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}