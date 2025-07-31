//src/app/page.js
'use client';
'use client';
import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    
    // Sticky header effect
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
    <div className="container py-8">
      {/* Sticky header */}
      <div 
        ref={headerRef}
        className={`sticky-header ${isSticky ? 'sticky' : ''}`}
      >
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={fetchProducts}
            />
          ))}
        </div>
      )}

      <FloatingButton href="/create">
        <AddIcon />
      </FloatingButton>
    </div>
  );
}

const EmptyState = () => (
  <div className="text-center py-20">
    <div className="text-5xl mb-4">👗</div>
    <h3 className="text-xl font-semibold mb-2">No products found</h3>
    <p className="text-light-text mb-4">
      Try adjusting your search or create a new product
    </p>
    <a 
      href="/create" 
      className="inline-block bg-accent text-white px-6 py-2 rounded-full font-medium"
    >
      Add Product
    </a>
  </div>
);

const FloatingButton = styled(Fab)({
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  '&:hover': {
    backgroundColor: '#c0392b',
  },
});