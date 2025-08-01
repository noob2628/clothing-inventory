// src/app/lib/db.js
import { query } from './database';

// Helper function to map database row to product object
const mapRowToProduct = (row) => ({
  id: row.id,
  sku: row.sku,
  name: row.name,
  code: row.code,
  variations: row.variations,
  productImages: row.product_images,
  fabricImages: row.fabric_images,
  category: row.category,
  suppliers: row.suppliers,
  sizes: row.sizes,
  lastUpdatedBy: row.last_updated_by,
  lastUpdatedAt: row.last_updated_at,
  location: row.location
});

export const readData = async () => {
  try {
    const res = await query('SELECT * FROM products');
    return { products: res.rows.map(mapRowToProduct) };
  } catch (error) {
    console.error('Error reading data:', error);
    return { products: [] };
  }
};

export const getProductById = async (id) => {
  const res = await query('SELECT * FROM products WHERE id = $1', [id]);
  return res.rows.length ? mapRowToProduct(res.rows[0]) : null;
};

export const createProduct = async (product) => {
  const { rows } = await query(
    `INSERT INTO products (
      id, sku, name, code, variations, product_images, 
      fabric_images, category, suppliers, sizes,
      last_updated_by, last_updated_at, location
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [
      product.id,
      product.sku,
      product.name,
      product.code,
      product.variations,
      product.productImages,
      product.fabricImages,
      product.category,
      product.suppliers,
      product.sizes,
      product.lastUpdatedBy || 'admin',
      new Date().toISOString(),
      product.location || 'Warehouse A'
    ]
  );
  return mapRowToProduct(rows[0]);
};

export const updateProduct = async (id, updates) => {
  const product = await getProductById(id);
  if (!product) return null;

  const updatedProduct = { 
    ...product, 
    ...updates,
    lastUpdatedBy: updates.lastUpdatedBy || 'admin',
    lastUpdatedAt: new Date().toISOString()
  };
  
  await query(
    `UPDATE products SET
      sku = $1,
      name = $2,
      code = $3,
      variations = $4,
      product_images = $5,
      fabric_images = $6,
      category = $7,
      suppliers = $8,
      sizes = $9,
      last_updated_by = $10,
      last_updated_at = $11,
      location = $12
    WHERE id = $13`,
    [
      updatedProduct.sku,
      updatedProduct.name,
      updatedProduct.code,
      updatedProduct.variations,
      updatedProduct.productImages,
      updatedProduct.fabricImages,
      updatedProduct.category,
      updatedProduct.suppliers,
      updatedProduct.sizes,
      updatedProduct.lastUpdatedBy,
      updatedProduct.lastUpdatedAt,
      updatedProduct.location,
      id
    ]
  );
  
  return updatedProduct;
};

export const deleteProduct = async (id) => {
  await query('DELETE FROM products WHERE id = $1', [id]);
};