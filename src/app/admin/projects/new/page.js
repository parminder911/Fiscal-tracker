'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    project_name: '',
    description: '',
    district_id: '',
    district_name: '',
    village_id: '',
    total_budget: ''
  });
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch districts on mount
  useEffect(() => {
    fetch('/api/districts/list')
      .then(r => r.json())
      .then(data => setDistricts(data.districts || []))
      .catch(e => console.error('Error fetching districts:', e));
  }, []);

  // Fetch villages when district changes
  useEffect(() => {
    if (!form.district_id) return setVillages([]);
    fetch(`/api/villages/list?district_id=${form.district_id}`)
      .then(r => r.json())
      .then(data => setVillages(data.villages || []))
      .catch(() => setVillages([]));
  }, [form.district_id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: form.project_name,
          description: form.description,
          district_id: form.district_id ? Number(form.district_id) : null,
          village_id: form.village_id ? Number(form.village_id) : null,
          total_budget: Number(form.total_budget)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create project');
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Create Project</h1>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <label>Project Name</label>
        <input name="project_name" value={form.project_name} onChange={onChange} className="form-control" required />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} className="form-control" rows={4} />
        <label>District</label>
        <select name="district_id" value={form.district_id} onChange={(e) => {
          const selected = districts.find(d => d.id === Number(e.target.value));
          setForm(prev => ({
            ...prev,
            district_id: e.target.value,
            district_name: selected ? selected.name : ''
          }));
        }} className="form-control" required>
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <label>Village</label>
        <select name="village_id" value={form.village_id} onChange={onChange} className="form-control">
          <option value="">Select village (optional)</option>
          {villages.map(v => (
            <option key={v.id} value={v.id}>{v.village_name}</option>
          ))}
        </select>
        <label>Total Budget (₹)</label>
        <input name="total_budget" type="number" value={form.total_budget} onChange={onChange} className="form-control" required />
        <div style={{ marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => router.push('/admin')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
