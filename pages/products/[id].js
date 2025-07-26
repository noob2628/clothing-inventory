import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { sizeFields, getLabel } from '../../lib/sizeFields';


export default function ProductDetail() {
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

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500">&larr; Back to Products</Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-1">SKU: {product.sku}</p>
            <p className="text-gray-600 mb-1">Code: {product.code}</p>
            <p className="text-gray-600 mb-4">Variation: {product.variations}</p>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Size Measurements (cm)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sizeFields[product.category].map(field => (
                    <div key={field} className="border p-3 rounded">
                        <div className="font-medium">{getLabel(field)}</div>
                        <div>{product.sizes[field] || 0}</div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Suppliers</h2>
              <ul className="list-disc pl-5">
                {product.suppliers.map((supplier, i) => (
                  <li key={i}>{supplier}</li>
                ))}
              </ul>
            </div>

            <Link 
              href={`/edit/${product.id}`} 
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit Product
            </Link>
          </div>

          <div className="md:w-1/2 p-6">
            <h2 className="text-xl font-semibold mb-2">Product Images</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.productImages.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`Product ${i+1}`} 
                  className="rounded object-cover h-48 w-full"
                />
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-2">Fabric Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {product.fabricImages.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`Fabric ${i+1}`} 
                  className="rounded object-cover h-48 w-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}