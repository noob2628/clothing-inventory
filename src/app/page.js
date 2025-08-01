// src/app/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import styles from './HomePage.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > headerRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setFilteredProducts(data);
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

  return (
    <div className={styles.container}>
      {/* Sticky header with improved UI */}
      <div 
        ref={headerRef}
        className={`${styles.stickyHeader} ${isSticky ? styles.sticky : ''}`}
        style={{ top: isSticky ? '80px' : '0' }}
      >
        <div className={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className={styles.contentArea}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👗</div>
            <h3 className={styles.emptyTitle}>No products found</h3>
            <p className={styles.emptyText}>
              Try adjusting your search or create a new product
            </p>
            <a 
              href="/create" 
              className={styles.emptyButton}
            >
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

      <a href="/create" className={styles.addButton}>
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </a>
    </div>
  );
}