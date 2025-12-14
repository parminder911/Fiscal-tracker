'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DistrictsPage() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/districts/list');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load districts');
        setDistricts(data.districts || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Punjab Districts</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {districts.map(d => (
          <li key={d.id}>
            <Link href={`/districts/${d.id}`}>{d.district_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
