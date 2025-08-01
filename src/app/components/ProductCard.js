// src/app/components/ProductCard.js
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { IconButton, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getUserRole } from '@/lib/auth';
import DeleteConfirmation from './DeleteConfirmation';
import { useState, useEffect } from 'react';

export default function ProductCard({ product, onDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [role, setRole] = useState('USER');
  const isMobile = useMediaQuery('(max-width:768px)'); // Detect mobile screens

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  const images = product.productImages.map(img => ({
    original: img,
    thumbnail: img
  }));

  const handleDelete = async () => {
    await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
    onDelete();
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[var(--card-shadow)] transition-transform hover:scale-[1.02]">
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{product.name}</h3>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">SKU: {product.sku}</p>
        
        <div className="flex justify-between mt-4">
            <IconButton 
            href={`/products/${product.id}`} 
            className="text-gray-600"
            >
            <VisibilityIcon />
            </IconButton>
            
            {role === 'ADMIN' && (
            <>
                <IconButton 
                href={`/products/${product.id}/edit`} 
                className="text-blue-500"
                >
                <EditIcon />
                </IconButton>
                
                <IconButton 
                onClick={() => setDeleteOpen(true)} 
                className="text-red-500"
                >
                <DeleteIcon />
                </IconButton>
            </>
            )}
        </div>
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={handleDelete}
            title={`Delete ${product.name}`}
            message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        />
      </div>
      
      <div className="h-48 overflow-hidden">
        {images.length > 0 ? (
          <ImageGallery
            items={images}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={!isMobile} // Hide arrows on mobile
            showThumbnails={false}
            autoPlay={!isMobile} // Disable auto play on mobile
            slideInterval={5000}
            showBullets={isMobile} // Show bullets on mobile for manual control
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center">
            <div className="text-4xl">👕</div>
          </div>
        )}
      </div>
    </div>
  );
}