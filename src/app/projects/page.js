'use client';

import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/projects/list?status=approved&limit=200');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load projects');
        setProjects(data.projects || []);
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
      <h1>Approved Projects</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Project Code</th>
                <th>Name</th>
                <th>District</th>
                <th>Village</th>
                <th>Allocated</th>
                <th>Utilized</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>{p.project_code}</td>
                  <td>{p.project_name}</td>
                  <td>{p.district_name || p.district_id}</td>
                  <td>{p.village_name || p.village_id}</td>
                  <td>₹{Number(p.budget_allocated || 0).toLocaleString()}</td>
                  <td>₹{Number(p.budget_utilized || 0).toLocaleString()}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
