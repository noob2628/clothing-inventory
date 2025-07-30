// src/app/create/page.js
'use client';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default function CreateProduct() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}