// src/app/api/products/[id]/route.js
import { 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    // Await params access
    const id = request.nextUrl.pathname.split('/').pop();
    const product = await getProductById(id);
    
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
    // Await params access
    const id = request.nextUrl.pathname.split('/').pop();
    const updated = await request.json();
    
    const updatedProduct = await updateProduct(id, updated);
    if (!updatedProduct) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return Response.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Await params access
    const id = request.nextUrl.pathname.split('/').pop();
    await deleteProduct(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}