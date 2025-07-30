// src/app/api/products/[id]/route.js
import { readData, writeData } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const db = await readData();
    const product = db.products.find(p => p.id === id);
    
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error('Error in GET product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const updated = await request.json();
    const db = await readData();
    
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
    
    db.products[index] = { ...db.products[index], ...updated };
    await writeData(db);
    return Response.json(db.products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const db = await readData();
    
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
    
    db.products.splice(index, 1);
    await writeData(db);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}