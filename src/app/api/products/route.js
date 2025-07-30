// src/app/api/products/route.js
import { createProduct, readData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = await readData();
    return Response.json(data.products);
  } catch (error) {
    console.error('Error reading products:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();
    newProduct.id = uuidv4();
    const createdProduct = await createProduct(newProduct);
    return Response.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}