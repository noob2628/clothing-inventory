// src/app/products/[id]/edit/page.js
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import ProductForm from '@/components/ProductForm';
import AuthGuard from '@/components/AuthGuard';
import styles from '../ProductDetail.module.css';

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        // you can use this to stick anything up top if needed
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update product: ${res.status}`);
      }
      
      router.push(`/products/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Once loaded
  return (
    <AuthGuard roles={['ADMIN']}>
      <div className={styles.container}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
          <ProductForm initialData={product} onSubmit={handleSubmit} />
        </div>
      </div>
    </AuthGuard>
  );
}
