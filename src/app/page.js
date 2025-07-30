//
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clothing Inventory</h1>
        <Link href="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            {product.productImages[0] && (
                <img 
                src={product.productImages[0]} 
                alt={product.name} 
                className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600">{product.sku} | {product.category}</p>
              
              <div className="mt-4 flex space-x-2">
                <Link 
                  href={`/products/${product.id}`} 
                  className="flex-1 text-center bg-green-500 text-white py-2 rounded"
                >
                  View
                </Link>
                <Link 
                  href={`/products/${product.id}/edit`}
                  className="flex-1 text-center bg-yellow-500 text-white py-2 rounded"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}