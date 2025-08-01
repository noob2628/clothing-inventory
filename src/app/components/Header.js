// src/app/components/Header.js
'use client';
import Link from 'next/link';
import { logout, getUserRole } from '@/lib/auth';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [role, setRole] = useState('USER');
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setRole(getUserRole());
    setUsername(localStorage.getItem('username') || '');
    
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerClass = `${styles.header} ${isShrunk ? styles.shrink : ''}`;

  return (
    <header className={headerClass}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>👕</div>
          <h1 className={styles.title}>Kily Clothing Inventory</h1>
        </div>
        
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          {isClient && role && (
            <>
              <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              {role === 'ADMIN' && (
                <Link href="/create" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                  Add Product
                </Link>
              )}
            </>
          )}
        </nav>
        
        {isClient && role ? (
          <div className={`${styles.userSection} ${isMenuOpen ? styles.active : ''}`}>
            <span className={styles.username}>{username}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}