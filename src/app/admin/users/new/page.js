'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [villages, setVillages] = useState([]);
  const [form, setForm] = useState({
    user_id: '',
    password: '',
    full_name: '',
    email: '',
    phone: '',
    role: 'citizen',
    district_id: '',
    tehsil_id: '',
    village_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-generate a candidate user_id for display (backend ensures uniqueness)
  const generateUserId = () => 'PFT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  useEffect(() => {
    setForm(prev => ({ ...prev, user_id: generateUserId() }));
    fetch('/api/roles/list')
      .then(r => r.json())
      .then(data => setRoles(data.roles || []))
      .catch(() => setRoles([{ id: 5, role_name: 'citizen' }]));

    fetch('/api/districts/list')
      .then(r => r.json())
      .then(data => setDistricts(data.districts || []))
      .catch(() => setDistricts([]));
  }, []);

  useEffect(() => {
    if (!form.district_id) {
      setTehsils([]);
      setVillages([]);
      return;
    }
    // Load tehsils for selected district
    fetch(`/api/tehsils/list?district_id=${form.district_id}`)
      .then(r => r.json())
      .then(data => setTehsils(data.tehsils || []))
      .catch(() => setTehsils([]));
  }, [form.district_id]);

  useEffect(() => {
    if (!form.tehsil_id) {
      setVillages([]);
      return;
    }
    // Load villages for selected tehsil
    fetch(`/api/villages/list?tehsil_id=${form.tehsil_id}`)
      .then(r => r.json())
      .then(data => setVillages(data.villages || []))
      .catch(() => setVillages([]));
  }, [form.tehsil_id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        user_id: '', // backend will always generate
        password: form.password,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        district_id: form.district_id || null,
        tehsil_id: form.tehsil_id || null,
        village_id: form.village_id || null
      };

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Create New User</h1>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <label>User ID (auto)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input name="user_id" value={form.user_id} readOnly className="form-control" />
          <button type="button" className="btn btn-secondary" onClick={() => setForm(prev => ({ ...prev, user_id: generateUserId() }))}>Regenerate</button>
        </div>
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} className="form-control" required />
        <label>Full Name</label>
        <input name="full_name" value={form.full_name} onChange={onChange} className="form-control" required />
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} className="form-control" />
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} className="form-control" />
        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange} className="form-control">
          {roles.map(r => (
            <option key={r.id} value={r.role_name}>{r.role_name}</option>
          ))}
        </select>
        <label>District (optional)</label>
        <select name="district_id" value={form.district_id} onChange={onChange} className="form-control">
          <option value="">Select district</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.district_name}</option>
          ))}
        </select>
        <label>Tehsil (optional)</label>
        <select name="tehsil_id" value={form.tehsil_id} onChange={onChange} className="form-control">
          <option value="">Select tehsil</option>
          {tehsils.map(t => (
            <option key={t.id} value={t.id}>{t.tehsil_name}</option>
          ))}
        </select>
        <label>Village (optional)</label>
        <select name="village_id" value={form.village_id} onChange={onChange} className="form-control">
          <option value="">Select village</option>
          {villages.map(v => (
            <option key={v.id} value={v.id}>{v.village_name}</option>
          ))}
        </select>
        <div style={{ marginTop: 16 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => router.push('/admin')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
