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
  Typography,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { getLabel, sizeFields } from '@/lib/sizeFields';
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
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('cm'); // New state for unit
  const fields = sizeFields[formData.category] || [];

  const convertValue = (value, fromUnit, toUnit) => {
    if (value === '') return '';
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'cm' && toUnit === 'inch') return value / 2.54;
    if (fromUnit === 'inch' && toUnit === 'cm') return value * 2.54;
    return value;
  };

  const convertSizes = (sizes, fromUnit, toUnit) => {
    const converted = {};
    for (const key in sizes) {
      converted[key] = convertValue(sizes[key], fromUnit, toUnit);
    }
    return converted;
  };

  const handleUnitChange = (newUnit) => {
    if (unit === newUnit) return;

    // Convert all size values
    const convertedSizes = {};
    Object.keys(formData.sizes).forEach(field => {
      convertedSizes[field] = convertValue(formData.sizes[field], unit, newUnit);
    });

    setFormData(prev => ({
      ...prev,
      sizes: convertedSizes
    }));
    
    setUnit(newUnit);
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    
    // Allow empty string for deletion
    if (value === '') {
      setFormData(prev => ({
        ...prev,
        sizes: { 
          ...prev.sizes, 
          [name]: ''
        }
      }));
      return;
    }
    
    // Only parse as number if not empty
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      sizes: { 
        ...prev.sizes, 
        [name]: numericValue
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Add validation before submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Handle empty values in sizes
    const sizesToSubmit = {};
    for (const [key, value] of Object.entries(formData.sizes)) {
      sizesToSubmit[key] = value === '' ? 0 : value;
    }

    // Convert to CM if needed
    let finalSizes = sizesToSubmit;
    if (unit === 'inch') {
      finalSizes = convertSizes(sizesToSubmit, 'inch', 'cm');
    }

    const cleanData = {
      ...formData,
      sizes: finalSizes, // Use converted sizes
      lastUpdatedBy: username,
      productImages: formData.productImages.filter(url => url.trim() !== ''),
      fabricImages: formData.fabricImages.filter(url => url.trim() !== '')
    };
    
    try {
      await onSubmit(cleanData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add URL validation function
  const isValidUrl = (url) => {
    if (!url.trim()) return true; // Allow empty during editing
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
              <MenuItem value="NO CATEGORY">No Category</MenuItem>
              <MenuItem value="TOPS">Tops</MenuItem>
              <MenuItem value="PANTS/SHORT">Pants/Short</MenuItem>
              <MenuItem value="SKIRT">Skirt</MenuItem>
              <MenuItem value="DRESS">Dress</MenuItem>
              <MenuItem value="TERNO">Terno</MenuItem> {/* New option */}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Size Measurements */}
      <div className={styles.section}>
        <div className={styles.unitHeader}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Size Measurements ({unit})
          </Typography>
          <ButtonGroup variant="outlined" aria-label="Unit toggle">
            <Tooltip title="Centimeters">
              <Button 
                variant={unit === 'cm' ? 'contained' : 'outlined'} 
                onClick={() => handleUnitChange('cm')}
              >
                CM
              </Button>
            </Tooltip>
            <Tooltip title="Inches">
              <Button 
                variant={unit === 'inch' ? 'contained' : 'outlined'} 
                onClick={() => handleUnitChange('inch')}
              >
                Inch
              </Button>
            </Tooltip>
          </ButtonGroup>
        </div>
        
        <div className={styles.sizeGrid}>
          {(sizeFields[formData.category] || []).map(field => (
            <TextField
              key={field}
              label={getLabel(field)}
              name={field}
              type="number"
              value={formData.sizes[field] === 0 ? '' : formData.sizes[field]}
              onChange={handleSizeChange}
              InputProps={{ 
                inputProps: { 
                  step: unit === 'cm' ? 0.1 : 0.01 
                } 
              }}
              fullWidth
              onFocus={(e) => {
                // Clear the field when focused if it's 0
                if (parseFloat(e.target.value) === 0) {
                  handleSizeChange({ 
                    target: { 
                      name: field, 
                      value: '' 
                    }
                  });
                }
              }}
            />
          ))}
        </div>
      </div>


      {/* Size Range, Packaging Description, and Things to Remember */}
      <div className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Product Details
        </Typography>
        <div className={styles.grid}>
          <TextField
            label="Things to Remember"
            name="thingsToRemember"
            value={formData.thingsToRemember || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
            placeholder="Important notes and care instructions"
          />

          <TextField
            label="Packaging Description"
            name="packagingDescription"
            value={formData.packagingDescription || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={8}
            placeholder="Short packaging details"
          />

          <TextField
            label="Size Range"
            name="sizeRange"
            value={formData.sizeRange || ''}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., S, M, L, XL"
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
          Product Images URL Link
        </Typography>
        {formData.productImages.map((img, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={img}
                onChange={(e) => handleArrayChange('productImages', index, e.target.value)}
                placeholder="Image URL"
                error={!isValidUrl(img)}
                helperText={!isValidUrl(img) && "Invalid URL"}
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
          Fabric Images URL Link
        </Typography>
        {formData.fabricImages.map((img, index) => (
          <Grid container spacing={2} alignItems="center" key={index} className={styles.arrayItem}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                value={img}
                onChange={(e) => handleArrayChange('fabricImages', index, e.target.value)} // Fix field name
                placeholder="Image URL"
                error={!isValidUrl(img)}
                helperText={!isValidUrl(img) && "Invalid URL"}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton 
                onClick={() => removeArrayItem('fabricImages', index)} // Fix field name
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
        {loading ? <CircularProgress size={24} /> : (initialData.id ? 'Update Product' : 'Create Product')}
      </Button>
    </form>
  );
};

export default ProductForm;