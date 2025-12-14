'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DistrictPanel.module.css';

export default function DistrictPanel({ user }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProject, setSelectedProject] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, objection: 0, rejected: 0 });

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const statuses = ['pending', 'approved', 'objection', 'rejected'];
      const counts = { pending: 0, approved: 0, objection: 0, rejected: 0 };
      
      for (const status of statuses) {
        const response = await fetch(`/api/projects/list?status=${status}&district_id=${user.district_id}`);
        const data = await response.json();
        if (data.success) {
          counts[status] = data.projects.length;
        }
      }
      setStats(counts);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const status = activeTab === 'pending' ? 'pending' : activeTab === 'approved' ? 'approved' : activeTab === 'objection' ? 'objection' : 'rejected';
      const response = await fetch(`/api/projects/list?status=${status}&district_id=${user.district_id}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForward = async (projectId) => {
    try {
      const response = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          action: 'forward',
          approver_id: user.id,
          current_level: 'district',
          remarks: remarks
        })
      });

      if (response.ok) {
        setRemarks('');
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error forwarding project:', error);
    }
  };

  const handleObjection = async (projectId) => {
    try {
      const response = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          action: 'object',
          approver_id: user.id,
          current_level: 'district',
          remarks: remarks
        })
      });

      if (response.ok) {
        setRemarks('');
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error objecting to project:', error);
    }
  };

  const handleReject = async (projectId) => {
    try {
      const response = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          action: 'reject',
          approver_id: user.id,
          current_level: 'district',
          remarks: remarks
        })
      });

      if (response.ok) {
        setRemarks('');
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  return (
    <div className={styles.districtContainer}>
      <div className={styles.header}>
        <div>
          <h1>District Level Panel</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
            👤 {user?.full_name} | 📍 District ID: {user?.district_id ?? 'N/A'}
          </p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/');
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, backgroundColor: '#e3f2fd', borderRadius: 8, border: '1px solid #90caf9' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>{stats.pending}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Pending</div>
        </div>
        <div style={{ padding: 16, backgroundColor: '#e8f5e9', borderRadius: 8, border: '1px solid #81c784' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#388e3c' }}>{stats.approved}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Approved</div>
        </div>
        <div style={{ padding: 16, backgroundColor: '#fff3e0', borderRadius: 8, border: '1px solid #ffb74d' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f57c00' }}>{stats.objection}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Objections</div>
        </div>
        <div style={{ padding: 16, backgroundColor: '#ffebee', borderRadius: 8, border: '1px solid #ef5350' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#d32f2f' }}>{stats.rejected}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Rejected</div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          📋 Pending ({stats.pending})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'approved' ? styles.active : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          ✓ Approved ({stats.approved})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'objection' ? styles.active : ''}`}
          onClick={() => setActiveTab('objection')}
        >
          ⚠️ Objections ({stats.objection})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'rejected' ? styles.active : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          ✗ Rejected ({stats.rejected})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'pending' && (
          <div className={styles.pendingSection}>
            <h2>Applications from Tehsil Level</h2>
            <div className={styles.projectsList}>
              {projects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>{project.project_name}</h3>
                    <span className={styles.projectCode}>{project.project_code}</span>
                  </div>
                  <div className={styles.projectDetails}>
                    <div className={styles.detail}>
                      <span className={styles.label}>Allocated Budget:</span>
                      <span className={styles.value}>₹{Number(project.budget_allocated || 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Village:</span>
                      <span className={styles.value}>{project.village_name}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Tehsil:</span>
                      <span className={styles.value}>{project.tehsil_name}</span>
                    </div>
                  </div>

                  {selectedProject === project.id && (
                    <div className={styles.actionPanel}>
                      <textarea
                        className={styles.remarksInput}
                        placeholder="Add remarks or objections..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.btn} ${styles.btnForward}`}
                          onClick={() => handleForward(project.id)}
                        >
                          Forward to Admin
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnObjection}`}
                          onClick={() => handleObjection(project.id)}
                        >
                          Raise Objection
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnReject}`}
                          onClick={() => handleReject(project.id)}
                        >
                          Reject
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnCancel}`}
                          onClick={() => {
                            setSelectedProject(null);
                            setRemarks('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedProject !== project.id && (
                    <button
                      className={styles.btnReview}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      Review & Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'approved' && (
          <div className={styles.approvedSection}>
            <h2>Approved Projects</h2>
            <div className={styles.projectsList}>
              {projects.length === 0 ? (
                <p>No approved projects yet.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3>{project.project_name}</h3>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>Allocated:</span>
                        <span className={styles.value}>₹{Number(project.budget_allocated || 0).toLocaleString()}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Utilized:</span>
                        <span className={styles.value}>₹{Number(project.budget_utilized || 0).toLocaleString()}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Village:</span>
                        <span className={styles.value}>{project.village_name}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.value} style={{ color: 'green' }}>✓ Approved</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'objection' && (
          <div className={styles.objectionSection}>
            <h2>Objected Projects</h2>
            <div className={styles.projectsList}>
              {projects.length === 0 ? (
                <p>No objected projects.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3>{project.project_name}</h3>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>Village:</span>
                        <span className={styles.value}>{project.village_name}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.value} style={{ color: 'orange' }}>⚠️ Objection</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Remarks:</span>
                        <span className={styles.value}>{project.remarks || 'No remarks'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'rejected' && (
          <div className={styles.rejectedSection}>
            <h2>Rejected Projects</h2>
            <div className={styles.projectsList}>
              {projects.length === 0 ? (
                <p>No rejected projects.</p>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <h3>{project.project_name}</h3>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>Village:</span>
                        <span className={styles.value}>{project.village_name}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.value} style={{ color: 'red' }}>✗ Rejected</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>Remarks:</span>
                        <span className={styles.value}>{project.remarks || 'No remarks'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.historySection}>
            <h2>Approval History</h2>
            <p>View all approved, rejected, and objected projects</p>
          </div>
        )}
      </div>
    </div>
  );
}
