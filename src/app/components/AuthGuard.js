// src/app/components/AuthGuard.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

export default function AuthGuard({ children, roles = ['ADMIN', 'USER'] }) {
  const router = useRouter();
  
  useEffect(() => {
    const role = getUserRole();
    
    if (!role) {
      router.push('/login');
    } else if (!roles.includes(role)) {
      router.push('/');
    }
  }, [router, roles]);

  return <>{children}</>;
}