'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPunjabDistricts } from '@/services/locationService';
import styles from './LoginPortal.module.css';

export default function LoginPortal() {
  const router = useRouter();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await getPunjabDistricts();
        setDistricts(data);
      } catch (err) {
        setError('Failed to load districts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoginLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      switch (data.user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'district':
          router.push('/district');
          break;
        case 'tehsil':
          router.push('/tehsil');
          break;
        case 'sarpanch':
          router.push('/sarpanch');
          break;
        case 'citizen':
          router.push('/citizen');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoginLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="container-fluid py-5">
        <div className="row">
          {/* Left Side - Login Portal */}
          <div className="col-lg-8">
            <div className={styles.loginSection}>
              <div className={styles.logoSection}>
                <h1 className={styles.mainTitle}>Fiscal Tracker</h1>
                <p className={styles.subtitle}>Punjab Transparency Portal</p>
              </div>

              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="userId" className="form-label fw-bold">
                      User ID
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="userId"
                      placeholder="Enter your username"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                    <small className="text-muted">
                      <a href="#forgot">Forgot user ID?</a>
                    </small>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label htmlFor="password" className="form-label fw-bold">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <small className="text-muted">
                      <a href="#forgot">Forgot Password?</a>
                    </small>
                  </div>
                </div>

                <div className="d-grid gap-2 mb-4">
                  <button type="submit" className={`btn btn-primary btn-lg ${styles.loginBtn}`}>
                    Login
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="row g-3 mt-2">
                <div className="col-md-6">
                  <button className={`btn btn-primary btn-lg w-100 ${styles.actionBtn}`}>
                    <i className="bi bi-house-fill"></i> Projects
                  </button>
                </div>
                <div className="col-md-6">
                  <button className={`btn btn-primary btn-lg w-100 ${styles.actionBtn}`}>
                    <i className="bi bi-download"></i> Tracking
                  </button>
                </div>
                <div className="col-md-6">
                  <button className={`btn btn-primary btn-lg w-100 ${styles.actionBtn}`}>
                    <i className="bi bi-check-circle"></i> Approved
                  </button>
                </div>
                <div className="col-md-6">
                  <button className={`btn btn-primary btn-lg w-100 ${styles.actionBtn}`}>
                    <i className="bi bi-person-check"></i> TRACK STATUS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Districts List */}
          <div className="col-lg-4">
            <div className={styles.districtSection}>
              <h3 className={styles.districtTitle}>Punjab Districts</h3>
              
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className={styles.districtList}>
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr className={styles.tableHeader}>
                        <th>Rank</th>
                        <th>District</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districts.map((district, index) => (
                        <tr key={district.id}>
                          <td className={styles.rank}>{index + 1}</td>
                          <td className={styles.districtName}>{district.name}</td>
                          <td className={styles.status}>
                            <span className={styles.badge}>✓</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className={styles.totalDistricts}>
                <strong>Total Districts: {districts.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




