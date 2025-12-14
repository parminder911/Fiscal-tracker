'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DistrictDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [districtName, setDistrictName] = useState('');
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        // First try to get district name from internal API
        let districtName = Array.isArray(id) ? id[0] : id;
        
        // Fetch tehsils and villages from data.gov.in API
        const API_KEY = '579b464db66ec23bdd00000107a171638a86478478e81d2566c5dd74';
        const url = `https://api.data.gov.in/resource/905bdf64-9799-41b2-965e-b24587ab24c3?api-key=${API_KEY}&format=json&filters[state_name]=PUNJAB&filters[district_name]=${encodeURIComponent(districtName)}&limit=10000`;
        
        const [apiRes, pRes] = await Promise.all([
          fetch(url),
          fetch(`/api/projects/list?district_id=${id}&status=approved`)
        ]);
        
        const apiData = await apiRes.json();
        const pData = await pRes.json();
        
        // Group villages by tehsil from API data
        const tehsilMap = new Map();
        if (apiData.records) {
          apiData.records.forEach(record => {
            const tehsil = record.tehsil_name || record.subdistrict_name;
            const village = record.village_name;
            
            if (tehsil && village) {
              if (!tehsilMap.has(tehsil)) {
                tehsilMap.set(tehsil, []);
              }
              tehsilMap.get(tehsil).push({
                id: village.toLowerCase().replace(/\s+/g, '-'),
                village_name: village,
                tehsil_name: tehsil
              });
            }
          });
        }
        
        // Convert Map to arrays
        const tehsils = Array.from(tehsilMap.keys()).map((tehsilName, index) => ({
          id: index + 1,
          tehsil_name: tehsilName
        }));
        
        const allVillages = [];
        tehsilMap.forEach((villages, tehsilName) => {
          allVillages.push(...villages);
        });
        
        setTehsils(tehsils);
        setVillages(allVillages);
        setProjects(pData.projects || []);
        setDistrictName(districtName);
      } catch (err) {
        console.error('Error loading from data.gov.in API:', err);
        setError('Failed to fetch from data.gov.in API, trying fallback...');
        
        // Fallback to internal APIs if external API fails
        try {
          const [tRes, vRes, pRes] = await Promise.all([
            fetch(`/api/tehsils/list?district_id=${id}`),
            fetch(`/api/villages/list?district_id=${id}`),
            fetch(`/api/projects/list?district_id=${id}&status=approved`)
          ]);
          
          if (!tRes.ok || !vRes.ok || !pRes.ok) {
            throw new Error('One or more fallback APIs returned error');
          }
          
          const tData = await tRes.json();
          const vData = await vRes.json();
          const pData = await pRes.json();
          
          setTehsils(tData.tehsils || []);
          setVillages(vData.villages || []);
          setProjects(pData.projects || []);
          setError('');
          console.log('Fallback APIs successful');
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
          setError(`Failed to load district data: ${fallbackErr.message}`);
          setTehsils([]);
          setVillages([]);
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const villagesByTehsil = (tehsilName) => {
    return villages.filter(v => v.tehsil_name === tehsilName);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#007bff', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Back to Districts
      </Link>
      
      <h1>📍 {districtName || 'District'}</h1>
      
      {loading && (
        <div style={{ padding: 20, backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: 8, color: '#004085' }}>
          ⏳ Loading district data...
        </div>
      )}
      
      {error && (
        <div style={{ padding: 20, backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8, color: '#721c24', marginBottom: 20 }}>
          ⚠️ {error}
        </div>
      )}
      
      <h2>Tehsils & Villages</h2>
      {!loading && tehsils.length === 0 ? (
        <div style={{ padding: 20, backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 8, color: '#856404' }}>
          📍 No tehsils or villages found for this district.
        </div>
      ) : (
        tehsils.map(t => {
          const villagesInTehsil = villagesByTehsil(t.tehsil_name);
          return (
            <div key={t.id} style={{ marginBottom: 24, borderLeft: '4px solid #007bff', paddingLeft: 16, paddingTop: 12, paddingBottom: 12 }}>
              <h3 style={{ margin: '0 0 12px 0' }}>{t.tehsil_name || t.name}</h3>
              {villagesInTehsil.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No villages found in this tehsil</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {villagesInTehsil.map(v => (
                    <li key={v.id} style={{ marginBottom: 8 }}>
                      <Link href={`/villages/${v.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
                        {v.village_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
      <h2>Approved Projects</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Village</th>
            <th>Allocated</th>
            <th>Utilized</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.project_code}</td>
              <td>{p.project_name}</td>
              <td>{p.village_name || p.village_id}</td>
              <td>₹{Number(p.budget_allocated || 0).toLocaleString()}</td>
              <td>₹{Number(p.budget_utilized || 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
