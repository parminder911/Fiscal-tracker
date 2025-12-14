'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function VillageDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [villageName, setVillageName] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/list?village_id=${id}`);
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0) {
          setVillageName(data.projects[0].village_name || `Village ${id}`);
        } else {
          setVillageName(`Village ${id}`);
        }
      } catch (err) {
        console.error('Error loading village data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const totalAllocated = projects.reduce((sum, p) => sum + (Number(p.budget_allocated) || 0), 0);
  const totalUtilized = projects.reduce((sum, p) => sum + (Number(p.budget_utilized) || 0), 0);
  const pendingProjects = projects.filter(p => p.status === 'pending').length;
  const approvedProjects = projects.filter(p => p.status === 'approved').length;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#007bff', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Back to Home
      </Link>
      
      <h1>📍 {villageName}</h1>
      {loading && <p>Loading...</p>}

      {/* Funds Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>Total Allocated</h3>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>
            ₹{totalAllocated.toLocaleString()}
          </p>
        </div>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>Total Utilized</h3>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>
            ₹{totalUtilized.toLocaleString()}
          </p>
        </div>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>Approved Projects</h3>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#17a2b8' }}>
            {approvedProjects}
          </p>
        </div>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f8f9fa' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>Pending Projects</h3>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 'bold', color: '#ffc107' }}>
            {pendingProjects}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <h2>Development Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found for this village.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Code</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Project Name</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Allocated</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Utilized</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Bills/Proofs</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: 12 }}>{p.project_code}</td>
                  <td style={{ padding: 12 }}>{p.project_name}</td>
                  <td style={{ padding: 12 }}>₹{Number(p.budget_allocated || 0).toLocaleString()}</td>
                  <td style={{ padding: 12 }}>₹{Number(p.budget_utilized || 0).toLocaleString()}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: p.status === 'approved' ? '#d4edda' : p.status === 'pending' ? '#fff3cd' : '#f8d7da',
                      color: p.status === 'approved' ? '#155724' : p.status === 'pending' ? '#856404' : '#721c24'
                    }}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    {p.attachment_url ? (
                      <a href={p.attachment_url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                        📄 View
                      </a>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
