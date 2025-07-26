import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../../components/ProductForm';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/products/${id}`, formData);
      router.push(`/products/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  );
}