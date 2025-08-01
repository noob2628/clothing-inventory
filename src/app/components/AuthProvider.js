// src/app/components/AuthProvider.js
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Client-side only
    const role = localStorage.getItem('userRole');
    
    // Redirect to login if not authenticated and not on login page
    if (!role && pathname !== '/login') {
      router.push('/login');
    }
    
    // Redirect to home if authenticated and on login page
    if (role && pathname === '/login') {
      router.push('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
}