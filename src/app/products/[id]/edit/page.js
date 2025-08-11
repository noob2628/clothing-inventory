// src/app/products/[id]/edit/page.js
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import ProductForm from '@/components/ProductForm';
import AuthGuard from '@/components/AuthGuard';

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Focus on loading state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Ensure loading state is set
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
        setLoading(false); // Always clear loading state
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true); // Show loading during submission
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
      setLoading(false);
    }
  };

  // Only show loading spinner when loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  // Show error if exists
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

  return (
    <AuthGuard roles={['ADMIN','SUPER_ADMIN']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductForm initialData={product} onSubmit={handleSubmit} />
      </div>
    </AuthGuard>
  );
}