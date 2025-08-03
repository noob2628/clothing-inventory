// src/app/components/Header.js
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaCog } from 'react-icons/fa';
import { logout, getUserRole } from '@/lib/auth';
import styles from './Header.module.css';

export default function Header() {
  const [role, setRole] = useState(null); // Initialize as null
  const [username, setUsername] = useState('');
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Client-side only operations
    const storedRole = getUserRole();
    const storedUsername = localStorage.getItem('username') || '';
    
    setRole(storedRole);
    setUsername(storedUsername);
    
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerClass = `${styles.header} ${isShrunk ? styles.shrink : ''}`;

  // Only render UI elements that depend on client-side state after hydration
  return (
    <header className={headerClass}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logo}>👕</div>
            <h1 className={styles.title}>Kily Clothing</h1>
          </Link>
        </div>
        
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        {/* Navigation and User Section Container */}
        <div className={`${styles.navContainer} ${isMenuOpen ? styles.active : ''}`}>
          {role !== null && ( // Only render when role is available
            <>
              <nav className={styles.userSection}>
                <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                {role === 'ADMIN' && (
                  <Link href="/create" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                    Add Product
                  </Link>
                )}
              </nav>
              
              {role ? (
                <div className={styles.userSection}>
                  <div className={styles.userInfo}>
                    <FaUserCircle className={styles.userIcon} />
                    <span className={styles.username}>{username}</span>
                    <span className={styles.userRole}>({role})</span>
                  </div>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className={styles.loginButton} onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}