// src/app/components/AuthProvider.js
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    
    // Update this condition to allow signup page
    if (!role && !['/login', '/signup'].includes(pathname)) {
      router.push('/login');
    }
    
    // Update this condition to include signup page
    if (role && ['/login', '/signup'].includes(pathname)) {
      router.push('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
}