// src/app/products/[id]/page.js
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sizeFields, getLabel } from '@/lib/sizeFields';
import dynamic from 'next/dynamic';
import styles from './ProductDetail.module.css';

const ImageGallery = dynamic(
  () => import('react-image-gallery').then(mod => mod.default),
  { ssr: false, loading: () => <div className={styles.emptyGallery}>Loading images...</div> }
);

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > headerRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <div className={styles.container}>
        <div className="error-message">Error: {error}</div>
        <button onClick={() => router.push('/')}>Back to Home</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className="spinner"></div>
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
      <div 
        ref={headerRef}
        className={`${styles.stickyHeader} ${isSticky ? styles.sticky : ''}`}
      >
        <Link href="/" className={styles.backLink}>
          <span className={styles.backIcon}>&larr;</span>
          Back to Products
        </Link>
      </div>

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

            <Link 
              href={`/products/${product.id}/edit`} 
              className={styles.editButton}
            >
              Edit Product
            </Link>
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
                    showPlayButton={false}
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
                    showPlayButton={false}
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