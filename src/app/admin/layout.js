// src/app/admin/layout.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return <>{children}</>;
}