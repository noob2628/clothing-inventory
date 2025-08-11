// src/app/lib/server/auth.js
import { query } from './database';

export const authenticateUser = async (username, password) => {
  const res = await query(
    'SELECT id, username, role FROM users WHERE username = $1 AND password = $2',
    [username, password]
  );
  return res.rows[0] || null;
};

export const getAllUsers = async () => {
  const res = await query('SELECT id, username, role FROM users');
  return res.rows;
};

export const updateUserRole = async (userId, newRole) => {
  await query(
    'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [newRole, userId]
  );
};

export const deleteUser = async (userId) => {
  await query('DELETE FROM users WHERE id = $1', [userId]);
};

export const getUser = async (userId) => {
  const res = await query(
    'SELECT id, username, role FROM users WHERE id = $1',
    [userId]
  );
  return res.rows[0] || null;
};
