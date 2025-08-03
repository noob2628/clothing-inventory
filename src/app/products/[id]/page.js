// src/app/products/[id]/page.js
'use client';

import 'react-image-gallery/styles/css/image-gallery.css';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import { sizeFields, getLabel } from '@/lib/sizeFields';
import dynamic from 'next/dynamic';
import styles from './ProductDetail.module.css';

const ImageGallery = dynamic(
  () => import('react-image-gallery').then(mod => mod.default),
  {
    ssr: false,
    loading: () => <div className={styles.emptyGallery}>Loading images...</div>
  }
);

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
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
        setIsSticky(window.scrollY > headerRef.current.offsetHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className="error-message">Error: {error}</div>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Back to Home
        </button>
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
      <div className={styles.productCard}>
        <div className={styles.gridContainer}>
          {/* Details Section */}
          <div className={styles.detailsSection}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>SKU</div>
                <div className={styles.metaValue}>{product.sku}</div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Product Name</div>
                <div className={styles.metaValue}>{product.name}</div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Code</div>
                <div className={styles.metaValue}>{product.code}</div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Category</div>
                <div className={styles.metaValue}>{product.category}</div>
              </div>
            </div>
            
            {/* Variations */}
            <div className={styles.variationsContainer}>
              <h2 className={styles.sectionTitle}>Variations</h2>
              <div className={styles.variationTags}>
                {product.variations.map((variation, i) => (
                  <span key={i} className={styles.variationTag}>
                    {variation}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Measurements */}
            <div className={styles.measurementsContainer}>
              <h2 className={styles.sectionTitle}>Size Measurements (cm)</h2>
              <div className={styles.measurementsGrid}>
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

            {/* Suppliers */}
            <div className={styles.suppliersContainer}>
              <h2 className={styles.sectionTitle}>Suppliers</h2>
              <ul className={styles.suppliersList}>
                {product.suppliers.map((supplier, i) => (
                  <li key={i} className={styles.supplierItem}>
                    {supplier}
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Product Info */}
            <div className={styles.detailsContainer}>
              <h2 className={styles.sectionTitle}>Product Details</h2>
              
              {product.sizeRange && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Size Range:</div>
                  <div className={styles.detailValue}>{product.sizeRange}</div>
                </div>
              )}
              
              {product.packagingDescription && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Packaging:</div>
                  <div className={styles.detailValue}>{product.packagingDescription}</div>
                </div>
              )}
              
              {product.thingsToRemember && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Notes:</div>
                  <div className={`${styles.detailValue} ${styles.preserveFormatting}`}>{product.thingsToRemember}</div>
                </div>
              )}
              {product.fabricType && (
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>Fabric Type:</div>
                  <div className={styles.detailValue}>{product.fabricType}</div>
                </div>
              )}
            </div>

            {/* Additional Info Section */}
            <div className={styles.detailsContainer}>
              <div className={styles.additionalInfo}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>{product.location || 'N/A'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Last Updated By</div>
                  <div className={styles.infoValue}>{product.lastUpdatedBy || 'N/A'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Last Updated At</div>
                  <div className={styles.infoValue}>
                    {product.lastUpdatedAt 
                      ? new Date(product.lastUpdatedAt).toLocaleString() 
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
              <div className={styles.detailsContainer}>
                <Link 
                  href={`/products/${product.id}/edit`} 
                  className={styles.editButton}
                >
                  Edit Product
                </Link>
              </div>
          </div>

          {/* Images Section */}
          <div className={styles.imagesSection}>
            {/* Product Images */}
            <div className={styles.galleryContainer}>
              <h2 className={styles.sectionTitle}>Product Images</h2>
              {productImages.length > 0 ? (
                <div className={styles.galleryWrapper}>
                  <ImageGallery
                    items={productImages}
                    showPlayButton={true}
                    showFullscreenButton={true}
                    showNav={true}
                    showBullets={true}
                    additionalClass={styles.imageGallery}
                  />
                </div>
              ) : (
                <div className={styles.emptyGallery}>
                  <div className={styles.placeholderIcon}>👕</div>
                  <p>No product images available</p>
                </div>
              )}
            </div>

            {/* Fabric Images */}
            <div className={styles.galleryContainer}>
              <h2 className={styles.sectionTitle}>Fabric Images</h2>
              {fabricImages.length > 0 ? (
                <div className={styles.galleryWrapper}>
                  <ImageGallery
                    items={fabricImages}
                    showPlayButton={true}
                    showFullscreenButton={true}
                    showNav={true}
                    showBullets={true}
                    additionalClass={styles.imageGallery}
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