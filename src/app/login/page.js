// src/app/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate, setUserSession } from '@/lib/auth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = authenticate(username, password);
    
    if (user) {
      setUserSession(user);
      router.push('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>👕</div>
        <h1 className={styles.title}>Kily Clothing Inventory</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          
          <div className={styles.credentials}>
            <p>Try these accounts:</p>
            <p><strong>USER:</strong> user / Temp123*</p>
            <p><strong>ADMIN:</strong> admin / Temp123*</p>
          </div>
        </form>
      </div>
    </div>
  );
}