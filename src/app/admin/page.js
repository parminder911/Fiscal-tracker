// src/app/admin/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminPanel/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || userData.role !== 'admin') {
      router.push('/');
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return user ? <AdminDashboard user={user} /> : null;
}