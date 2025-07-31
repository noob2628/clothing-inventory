'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sizeFields, getLabel } from '@/lib/sizeFields';
import dynamic from 'next/dynamic';
import styles from './ProductDetail.module.css';

const ImageGallery = dynamic(
  () => import('react-image-gallery').then(mod => mod.default),
  { ssr: false, loading: () => <div className={styles.galleryLoading}>Loading images...</div> }
);

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
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
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  const productImages = product.productImages.map(img => ({
    original: img,
    thumbnail: img
  }));

  const fabricImages = product.fabricImages.map(img => ({
    original: img,
    thumbnail: img
  }));

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Link href="/" className={styles.backLink}>
          &larr; Back to Products
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.cardGrid}>
          <div className={styles.detailsSection}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            <p className={styles.productMeta}>SKU: {product.sku}</p>
            <p className={styles.productMeta}>Code: {product.code}</p>
            <p className={styles.productMeta}>Category: {product.category}</p>
            
            <div className={styles.variations}>
              <h2 className={styles.sectionTitle}>Variations</h2>
              <div className={styles.variationGrid}>
                {product.variations.map((variation, i) => (
                  <span key={i} className={styles.variationTag}>
                    {variation}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.measurements}>
              <h2 className={styles.sectionTitle}>Size Measurements (cm)</h2>
              <div className={styles.measurementGrid}>
                {sizeFields[product.category].map(field => (
                  <div key={field} className={styles.measurementItem}>
                    <div className={styles.measurementLabel}>{getLabel(field)}</div>
                    <div className={styles.measurementValue}>
                      {product.sizes[field] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.suppliers}>
              <h2 className={styles.sectionTitle}>Suppliers</h2>
              <ul className={styles.supplierList}>
                {product.suppliers.map((supplier, i) => (
                  <li key={i} className={styles.supplierItem}>
                    {supplier}
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              href={`/products/${product.id}/edit`} 
              className={styles.editButton}
            >
              Edit Product
            </Link>
          </div>

          <div className={styles.imagesSection}>
            <div className={styles.galleryContainer}>
              <h2 className={styles.sectionTitle}>Product Images</h2>
              {productImages.length > 0 ? (
                <div className={styles.imageGalleryWrapper}>
                  <ImageGallery
                    items={productImages}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showNav={true}
                    showBullets={true}
                    additionalClass={styles.customGallery}
                  />
                </div>
              ) : (
                <div className={styles.emptyGallery}>
                  <div className={styles.placeholderIcon}>👕</div>
                  <p>No product images available</p>
                </div>
              )}
            </div>

            <div className={styles.galleryContainer}>
              <h2 className={styles.sectionTitle}>Fabric Images</h2>
              {fabricImages.length > 0 ? (
                <div className={styles.imageGalleryWrapper}>
                  <ImageGallery
                    items={fabricImages}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showNav={true}
                    showBullets={true}
                  />
                </div>
              ) : (
                <div className={styles.emptyGallery}>
                  <div className={styles.placeholderIcon}>🧵</div>
                  <p>No fabric images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}