// src/app/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Fab, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import styles from './HomePage.module.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getUserRole } from '@/lib/auth';
import Link from 'next/link';


export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);
  const [role, setRole] = useState(null);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.sku.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
    const userRole = getUserRole();
    setRole(userRole);

    const handleStorageChange = () => {
      setRole(getUserRole() || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      {/* Full-page loading overlay (optional) */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <CircularProgress />
        </div>
      )}

      {/* Sticky header with search bar */}
      <div
        ref={headerRef}
        className={`${styles.stickyHeader} ${isSticky ? styles.sticky : ''}`}
        style={{ top: isSticky ? '67px' : '0' }}
      >
        <div className={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Main content */}
      <div className={styles.contentArea}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <CircularProgress />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👗</div>
            <h3 className={styles.emptyTitle}>No products found</h3>
            <p className={styles.emptyText}>
              Try adjusting your search or create a new product
            </p>
            <a href="/create" className={styles.emptyButton}>
              Add Product
            </a>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={fetchProducts}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating “Add Product” button */}
      <a href="/create" className={styles.addButton}>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </a>
      {/*role === 'SUPER_ADMIN' && (
        <Link href="/signup" className={styles.addUserButton}>
          <Fab color="secondary" aria-label="add-user">
            <PersonAddIcon />
          </Fab>
        </Link>
      )*/}
    </div>
      
  );
}
