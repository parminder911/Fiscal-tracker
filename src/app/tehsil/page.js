'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TehsilPanel from '@/components/TehsilPanel/TehsilPanel';

export default function TehsilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || userData.role !== 'tehsil') {
      router.push('/');
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return user ? <TehsilPanel user={user} /> : null;
}
