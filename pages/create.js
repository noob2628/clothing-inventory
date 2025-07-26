import { useRouter } from 'next/router';
import axios from 'axios';
import ProductForm from '../components/ProductForm';

export default function CreateProduct() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      await axios.post('/api/products', formData);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}