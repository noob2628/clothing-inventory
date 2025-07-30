// components/ProductForm.js
import { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getLabel } from '@/lib/sizeFields';
import styles from './ProductForm.module.css';

const ProductForm = ({ initialData = {}, onSubmit }) => {
  const defaultProduct = {
    sku: '',
    name: '',
    code: '',
    variations: [],
    productImages: [],
    fabricImages: [],
    category: 'TOPS',
    suppliers: [],
    sizes: {
      // All size fields initialized to 0
      shoulder: 0,
      armhole: 0,
      sleeve: 0,
      sleeveHole: 0,
      underarmSleeve: 0,
      bust: 0,
      middleWidth: 0,
      lowerWidth: 0,
      sideLength: 0,
      middleLength: 0,
      waist: 0,
      length: 0,
      inseam: 0,
      fRise: 0,
      leghole: 0,
      hips: 0
    }
  };

  const [formData, setFormData] = useState(initialData.id ? initialData : defaultProduct);
  
  // Size fields by category
  const sizeFields = {
    TOPS: ['shoulder', 'armhole', 'sleeve', 'sleeveHole', 'underarmSleeve', 'bust', 'middleWidth', 'lowerWidth', 'sideLength', 'middleLength'],
    'PANTS/SHORT': ['waist', 'length', 'inseam', 'fRise', 'leghole', 'hips'],
    SKIRT: ['waist', 'sideLength', 'middleLength', 'middleWidth', 'lowerWidth'],
    DRESS: ['bust', 'shoulder', 'sleeveHole', 'sleeve', 'armhole', 'underarmSleeve', 'waist', 'sideLength', 'middleLength', 'lowerWidth']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      sizes: { ...prev.sizes, [name]: parseFloat(value) || 0 }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Product Information</h2>
        <div className={styles.grid}>
          <TextField
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="TOPS">Tops</MenuItem>
              <MenuItem value="PANTS/SHORT">Pants/Short</MenuItem>
              <MenuItem value="SKIRT">Skirt</MenuItem>
              <MenuItem value="DRESS">Dress</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Sizes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Size Measurements (cm)</h2>
        <div className={styles.sizeGrid}>
          {sizeFields[formData.category].map(field => (
            <TextField
              key={field}
              label={getLabel(field)}
              name={field}
              type="number"
              value={formData.sizes[field] || 0}
              onChange={handleSizeChange}
              InputProps={{ inputProps: { step: 0.1 } }}
              fullWidth
            />
          ))}
        </div>
      </div>


      {/* Variations */}
      <div>
        <label >Variations</label>
        {formData.variations.map((variation, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={variation}
              onChange={(e) => handleArrayChange('variations', index, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Variation name"
            />
            <button 
              type="button" 
              onClick={() => removeArrayItem('variations', index)}
              className="ml-2 px-3 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addArrayItem('variations')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Variation
        </button>
      </div>

      {/* Product Images */}
      <div>
        <label>Product Images</label>
        {formData.productImages.map((img, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={img}
              onChange={(e) => handleArrayChange('productImages', index, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Image URL"
            />
            <button 
              type="button" 
              onClick={() => removeArrayItem('productImages', index)}
              className="ml-2 px-3 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addArrayItem('productImages')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Image
        </button>
      </div>

      {/* Fabric Images */}
      <div>
        <label>Fabric Images</label>
        {formData.fabricImages.map((img, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={img}
              onChange={(e) => handleArrayChange('fabricImages', index, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Image URL"
            />
            <button 
              type="button" 
              onClick={() => removeArrayItem('fabricImages', index)}
              className="ml-2 px-3 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addArrayItem('fabricImages')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Image
        </button>
      </div>

      {/* Suppliers */}
      <div className={styles.section}>
        <label>Suppliers</label>
        {formData.suppliers.map((supplier, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              value={supplier}
              onChange={(e) => handleArrayChange('suppliers', index, e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Supplier name"
            />
            <button 
              type="button" 
              onClick={() => removeArrayItem('suppliers', index)}
              className="ml-2 px-3 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => addArrayItem('suppliers')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Supplier
        </button>
      </div>

      <Button 
        type="submit" 
        variant="contained" 
        className={styles.submitButton}
      >
        {initialData.id ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;