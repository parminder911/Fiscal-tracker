'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SarpanchPanel.module.css';

export default function SarpanchPanel({ user }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({ pending: 0, approved: 0, objection: 0, rejected: 0 });
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    total_budget: '',
    priority: 'medium',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const statuses = ['pending', 'approved', 'objection', 'rejected'];
      const counts = { pending: 0, approved: 0, objection: 0, rejected: 0 };
      
      for (const status of statuses) {
        const response = await fetch(`/api/projects/list?status=${status}&village_id=${user.village_id}`);
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
      const response = await fetch(`/api/projects/list?status=${status}&village_id=${user.village_id}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          village_id: user.village_id,
          district_id: user.district_id,
          tehsil_id: user.tehsil_id,
          created_by: user.id
        })
      });

      if (response.ok) {
        setFormData({
          project_name: '',
          description: '',
          total_budget: '',
          priority: 'medium',
          start_date: '',
          end_date: ''
        });
        setShowCreateForm(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.sarpanchContainer}>
      <div className={styles.header}>
        <div>
          <h1>Village Sarpanch Panel</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
            👤 {user?.full_name} | 📍 Village ID: {user?.village_id ?? 'N/A'}
          </p>
        </div>
        <button
          className={styles.btnCreate}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24, padding: '0 20px' }}>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #ddd', padding: '0 20px', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'pending' ? '#007bff' : 'transparent',
            color: activeTab === 'pending' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
            borderBottom: activeTab === 'pending' ? '3px solid #007bff' : 'none'
          }}
        >
          📋 Pending ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'approved' ? '#28a745' : 'transparent',
            color: activeTab === 'approved' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: activeTab === 'approved' ? 'bold' : 'normal',
            borderBottom: activeTab === 'approved' ? '3px solid #28a745' : 'none'
          }}
        >
          ✓ Approved ({stats.approved})
        </button>
        <button
          onClick={() => setActiveTab('objection')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'objection' ? '#ffc107' : 'transparent',
            color: activeTab === 'objection' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: activeTab === 'objection' ? 'bold' : 'normal',
            borderBottom: activeTab === 'objection' ? '3px solid #ffc107' : 'none'
          }}
        >
          ⚠️ Objections ({stats.objection})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          style={{
            padding: '12px 16px',
            border: 'none',
            background: activeTab === 'rejected' ? '#dc3545' : 'transparent',
            color: activeTab === 'rejected' ? 'white' : '#666',
            cursor: 'pointer',
            fontWeight: activeTab === 'rejected' ? 'bold' : 'normal',
            borderBottom: activeTab === 'rejected' ? '3px solid #dc3545' : 'none'
          }}
        >
          ✗ Rejected ({stats.rejected})
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.actionBar}>
          <button
            className={styles.btnCreate}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create New Project'}
          </button>
        </div>

        {showCreateForm && (
          <div className={styles.createForm}>
            <h2>Create New Project Request</h2>
            <form onSubmit={handleCreateProject}>
              <div className={styles.formGroup}>
                <label>Project Name *</label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Road Construction, School Building"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the project"
                  rows="4"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Total Budget (₹) *</label>
                  <input
                    type="number"
                    name="total_budget"
                    value={formData.total_budget}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 500000"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.btnSubmit}>
                  Submit Project Request
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.projectsSection}>
          <h2>
            {activeTab === 'pending' && '📋 Pending Projects'}
            {activeTab === 'approved' && '✓ Approved Projects'}
            {activeTab === 'objection' && '⚠️ Projects with Objections'}
            {activeTab === 'rejected' && '✗ Rejected Projects'}
          </h2>
          <div className={styles.projectsList}>
            {projects.length === 0 ? (
              <p className={styles.noProjects}>
                {activeTab === 'pending' && 'No pending projects. Create your first project request.'}
                {activeTab === 'approved' && 'No approved projects yet.'}
                {activeTab === 'objection' && 'No projects with objections.'}
                {activeTab === 'rejected' && 'No rejected projects.'}
              </p>
            ) : (
              projects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <h3>{project.project_name}</h3>
                    <span className={`${styles.badge} ${styles[project.status]}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className={styles.projectDetails}>
                    <div className={styles.detail}>
                      <span className={styles.label}>Project Code</span>
                      <span className={styles.value}>{project.project_code}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Total Budget</span>
                      <span className={styles.value}>₹{parseFloat(project.total_budget || 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Allocated</span>
                      <span className={styles.value}>₹{parseFloat(project.allocated_budget || 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Utilized</span>
                      <span className={styles.value}>₹{parseFloat(project.utilized_budget || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {(activeTab === 'objection' || activeTab === 'rejected') && project.remarks && (
                    <div style={{ padding: 12, backgroundColor: '#fff3cd', borderRadius: 4, marginTop: 12, borderLeft: '4px solid #ffc107' }}>
                      <strong style={{ color: '#856404' }}>Remarks from {project.remarks_by || 'Officer'}:</strong>
                      <p style={{ margin: '8px 0 0 0', color: '#856404' }}>{project.remarks}</p>
                    </div>
                  )}

                  {(activeTab === 'approved' || activeTab === 'pending') && (
                    <>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progress}
                          style={{
                            width: `${(project.utilized_budget / project.allocated_budget) * 100 || 0}%`
                          }}
                        />
                      </div>
                      <p className={styles.progressText}>
                        {((project.utilized_budget / project.allocated_budget) * 100 || 0).toFixed(1)}% Utilized
                      </p>
                    </>
                  )}

                  {activeTab === 'objection' && (
                    <button
                      onClick={() => setSelectedProject(project.id)}
                      style={{
                        marginTop: 12,
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      📝 Write Response
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
