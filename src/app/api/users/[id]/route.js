// src/app/api/users/[id]/route.js
import { updateUserRole, deleteUser, getUser } from '@/lib/server/auth';

export async function PUT(request) {
  try {
    // Extract ID from URL path
    const id = request.nextUrl.pathname.split('/').pop();
    
    const { role } = await request.json();
    const requesterId = request.headers.get('x-user-id');
    
    if (!requesterId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requester = await getUser(requesterId);
    if (!requester || requester.role !== 'SUPER_ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    await updateUserRole(id, role);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    // Extract ID from URL path
    const id = request.nextUrl.pathname.split('/').pop();
    
    const requesterId = request.headers.get('x-user-id');
    if (!requesterId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requester = await getUser(requesterId);
    if (!requester || requester.role !== 'SUPER_ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    await deleteUser(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Database error' }, { status: 500 });
  }
}