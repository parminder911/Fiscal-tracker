'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DistrictPanel from '@/components/DistrictPanel/DistrictPanel';

export default function DistrictPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id || userData.role !== 'district') {
      router.push('/');
      return;
    }
    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return user ? <DistrictPanel user={user} /> : null;
}
