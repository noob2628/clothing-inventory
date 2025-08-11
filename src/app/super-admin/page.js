// src/app/super-admin/page.js
'use client';
import { useState, useEffect } from 'react';
import { getUserId } from '@/lib/auth';
import styles from './SuperAdminPage.module.css';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function SuperAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const userId = getUserId();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': getUserId()
        },
        body: JSON.stringify({ role: newRole })
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 
            'X-User-Id': getUserId()
          }
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <AuthGuard roles={['SUPER_ADMIN']}>
      <div className={styles.container}>
        <h1>User Management</h1>
        {error && <div className={styles.error}>{error}</div>}
        
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={styles.roleSelect}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthGuard>
  );
}