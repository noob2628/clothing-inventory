// src/app/components/ProductForm.js
import { useState, useEffect} from 'react';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getLabel } from '@/lib/sizeFields';
import styles from './ProductForm.module.css';
import { getUserRole } from '@/lib/auth';

const ProductForm = ({ initialData = {}, onSubmit }) => {
  
  const role = getUserRole();
  const [username, setUsername] = useState('');
  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'admin');
  }, []);

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
    },
    sizeRange: '',
    packagingDescription: '',
    thingsToRemember: '',
    fabricType: ''
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
    
    const updatedData = {
      ...formData,
      lastUpdatedBy: username,
      location: formData.location || 'Warehouse A'
    };
    
    onSubmit(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Product Information */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Product Information
        </Typography>
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

      {/* Size Measurements */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Size Measurements (cm)
        </Typography>
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
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Variations
        </Typography>
        {formData.variations.map((variation, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={variation}
                onChange={(e) => handleArrayChange('variations', index, e.target.value)}
                placeholder="Variation name"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton 
                onClick={() => removeArrayItem('variations', index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button 
          startIcon={<AddIcon />}
          onClick={() => addArrayItem('variations')}
          variant="outlined"
          className={styles.addButton}
        >
          Add Variation
        </Button>
      </div>

      {/* Product Images */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Product Images
        </Typography>
        {formData.productImages.map((img, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={img}
                onChange={(e) => handleArrayChange('productImages', index, e.target.value)}
                placeholder="Image URL"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton 
                onClick={() => removeArrayItem('productImages', index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button 
          startIcon={<AddIcon />}
          onClick={() => addArrayItem('productImages')}
          variant="outlined"
          className={styles.addButton}
        >
          Add Image
        </Button>
      </div>

      {/* Fabric Images */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Fabric Images
        </Typography>
        {formData.fabricImages.map((img, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={img}
                onChange={(e) => handleArrayChange('fabricImages', index, e.target.value)}
                placeholder="Image URL"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton 
                onClick={() => removeArrayItem('fabricImages', index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button 
          startIcon={<AddIcon />}
          onClick={() => addArrayItem('fabricImages')}
          variant="outlined"
          className={styles.addButton}
        >
          Add Image
        </Button>
      </div>

      {/* Suppliers */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Suppliers
        </Typography>
        {formData.suppliers.map((supplier, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={supplier}
                onChange={(e) => handleArrayChange('suppliers', index, e.target.value)}
                placeholder="Supplier name"
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton 
                onClick={() => removeArrayItem('suppliers', index)}
                color="error"
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button 
          startIcon={<AddIcon />}
          onClick={() => addArrayItem('suppliers')}
          variant="outlined"
          className={styles.addButton}
        >
          Add Supplier
        </Button>
      </div>
      
      {/* Size Range, Packaging Description, and Things to Remember */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Product Details
        </Typography>
        <div className={styles.grid}>
          <TextField
            label="Size Range"
            name="sizeRange"
            value={formData.sizeRange || ''}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., S, M, L, XL"
          />
          
          <TextField
            label="Packaging Description"
            name="packagingDescription"
            value={formData.packagingDescription || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            placeholder="Short packaging details"
          />
          
          <TextField
            label="Things to Remember"
            name="thingsToRemember"
            value={formData.thingsToRemember || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Important notes and care instructions"
          />
          <TextField
            label="Fabric Type"
            name="fabricType"
            value={formData.fabricType || ''}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., Cotton, Polyester"
          />
        </div>
      </div>

      {/* Location and Last Updated Info */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Additional Information
        </Typography>
        <div className={styles.grid}>
          <TextField
            label="Location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            fullWidth
          />
          
          {initialData.id && (
            <div className={styles.infoGroup}>
              <div className={styles.infoLabel}>Last Updated By:</div>
              <div className={styles.infoValue}>
                {initialData.lastUpdatedBy || 'N/A'}
              </div>
            </div>
          )}
          
          {initialData.id && (
            <div className={styles.infoGroup}>
              <div className={styles.infoLabel}>Last Updated At:</div>
              <div className={styles.infoValue}>
                {initialData.lastUpdatedAt 
                  ? new Date(initialData.lastUpdatedAt).toLocaleString() 
                  : 'N/A'}
              </div>
            </div>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        variant="contained" 
        className={styles.submitButton}
        fullWidth
      >
        {initialData.id ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default ProductForm;