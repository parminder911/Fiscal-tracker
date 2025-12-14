'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TehsilPanel.module.css';

export default function TehsilPanel({ user }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProject, setSelectedProject] = useState(null);
  const [remarks, setRemarks] = useState('');
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
        const response = await fetch(`/api/projects/list?status=${status}&tehsil_id=${user.tehsil_id}`);
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
      const response = await fetch(`/api/projects/list?status=${status}&tehsil_id=${user.tehsil_id}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
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
          current_level: 'tehsil',
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
          current_level: 'tehsil',
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
          current_level: 'tehsil',
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
    <div className={styles.tehsilContainer}>
      <div className={styles.header}>
        <div>
          <h1>Tehsil Level Panel</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
            👤 {user?.full_name} | 📍 Tehsil ID: {user?.tehsil_id ?? 'N/A'}
          </p>
        </div>
        <button
          className={styles.btn}
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
          📜 Action History
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'pending' && (
          <div className={styles.pendingSection}>
            <h2>Project Requests from Villages</h2>
            <div className={styles.projectsList}>
              {projects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <div>
                      <h3>{project.project_name}</h3>
                      <p className={styles.village}>Village: {project.village_name}</p>
                    </div>
                    <span className={styles.projectCode}>{project.project_code}</span>
                  </div>

                  <div className={styles.projectDetails}>
                    <div className={styles.detail}>
                      <span className={styles.label}>Total Budget</span>
                      <span className={styles.value}>₹{parseFloat(project.total_budget).toLocaleString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Department</span>
                      <span className={styles.value}>{project.department_name || 'N/A'}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Priority</span>
                      <span className={`${styles.value} ${styles[project.priority]}`}>{project.priority}</span>
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
                          Forward to District
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
                      <div>
                        <h3>{project.project_name}</h3>
                        <p className={styles.village}>Village: {project.village_name}</p>
                      </div>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>Budget:</span>
                        <span className={styles.value}>₹{Number(project.total_budget || 0).toLocaleString()}</span>
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
                      <div>
                        <h3>{project.project_name}</h3>
                        <p className={styles.village}>Village: {project.village_name}</p>
                      </div>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
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
                      <div>
                        <h3>{project.project_name}</h3>
                        <p className={styles.village}>Village: {project.village_name}</p>
                      </div>
                      <span className={styles.projectCode}>{project.project_code}</span>
                    </div>
                    <div className={styles.projectDetails}>
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
            <h2>Action History</h2>
            <p>View all actions taken on project requests</p>
          </div>
        )}
      </div>
    </div>
  );
}
