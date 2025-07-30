// src/app/api/products/route.js
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '@/lib/db';

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
    const db = await readData();
    db.products.push(newProduct);
    await writeData(db);
    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}