// components/ProductForm.js
import { useState } from 'react';
import { sizeFields, getLabel } from '../lib/sizeFields';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>SKU</label>
          <input 
            type="text" 
            name="sku" 
            value={formData.sku} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Code</label>
          <input 
            type="text" 
            name="code" 
            value={formData.code} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="TOPS">Tops</option>
            <option value="PANTS/SHORT">Pants/Short</option>
            <option value="SKIRT">Skirt</option>
            <option value="DRESS">Dress</option>
          </select>
        </div>
      </div>

      {/* Variations */}
      <div>
        <label>Variations</label>
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
      <div>
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

      {/* Sizes */}
      <div className="border-t pt-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Size Measurements (cm)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sizeFields[formData.category].map(field => (
            <div key={field}>
                <label>{getLabel(field)}</label>
                <input
                type="number"
                name={field}
                value={formData.sizes[field] || 0}
                onChange={handleSizeChange}
                step="0.1"
                className="w-full p-2 border rounded"
                />
            </div>
            ))}
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-green-600 text-white rounded">
        {initialData.id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;