// src/app/components/ProductCard.js
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getUserRole } from '@/lib/auth';
import DeleteConfirmation from './DeleteConfirmation';
import { useState, useEffect } from 'react';

export default function ProductCard({ product, onDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [role, setRole] = useState('USER');
  const isMobile = useMediaQuery('(max-width:768px)');

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
    <div className="
        bg-white
        rounded-xl
        overflow-hidden
        shadow-[0_4px_20px_rgba(0,0,0,0.1)]
        transition-all
        duration-200
        hover:shadow-[0_8px_24px_rgba(0,0,0,0,0.2)]
        hover:scale-[1.02]
        flex
        flex-col
        items-center
        text-center
      ">
      
      <div className="p-6 w-full flex flex-col items-center justify-center text-center space-y-2">
        {/* SKU 
        <span className="inline-block bg-pink-50 text-pink-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
          {product.sku}
        </span>
        */}

        {/* Product Name */}
        <h3 className="font-[‘Playfair Display’,serif] text-2xl md:text-3xl text-gray-800 truncate">
          {product.name}
        </h3>

        {/* Item Code */}
        <p className="text-sm text-gray-500 tracking-wide">Item Code: <span className="font-medium">{product.sku}</span></p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Tooltip title="View details">
            <IconButton
              href={`/products/${product.id}`}
              size="medium"
              color="primary"
              variant="contained"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {role === 'ADMIN' && (
            <>
              <Tooltip title="Edit product">
                <IconButton
                  href={`/products/${product.id}/edit`}
                  size="medium"
                  color="secondary"
                  variant="contained"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete product">
                <IconButton
                  onClick={() => setDeleteOpen(true)}
                  size="medium"
                  color="error"
                  variant="contained"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>


        <DeleteConfirmation
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title={`Delete ${product.name}`}
          message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        />
      </div>
      
      <div className="w-full h-48 overflow-y-auto overflow-x-hidden">
        {images.length > 0 ? (
          <ImageGallery
            items={images}
            showPlayButton={true}
            showFullscreenButton={true}
            showNav={false}
            showThumbnails={true}
            autoPlay={!isMobile}
            slideInterval={5000}
            showBullets={isMobile}
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center">
            <span className="text-4xl">👕</span>
          </div>
        )}
      </div>
    </div>
  );
}
