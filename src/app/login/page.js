// src/app/login/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUserSession } from '@/lib/auth';
import styles from './LoginPage.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const user = await response.json();
        setUserSession(user);
        
        if (user.role === 'SUPER_ADMIN') {
          router.push('/super-admin');
        } else {
          router.push('/');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className={styles.error}>
              <div className={styles.errorIcon}>!</div>
              <div>{error}</div>
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
              'Login'
            )}
          </button>
          
          <div className={styles.signupLink}>
            Don&#39;t have an account? <Link href="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}