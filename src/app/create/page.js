// src/app/create/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import ProductForm from '@/components/ProductForm';
import AuthGuard from '@/components/AuthGuard';

export default function CreateProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      router.push('/');
    } catch (err) {
      console.error(err);
      // you could set an error state here to show a message
    } finally {
      setLoading(false);
    }
  };

  // Show full-screen loader while creating
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthGuard roles={['ADMIN']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
        <ProductForm onSubmit={handleSubmit} disabled={loading} />
      </div>
    </AuthGuard>
  );
}
