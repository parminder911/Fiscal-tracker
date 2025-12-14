'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard({ user }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    objection: 0,
    rejected: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchGrievances = async () => {
      if (activeTab !== 'grievances') return;
      try {
        const res = await fetch('/api/grievances/list');
        const data = await res.json();
        if (data.success) setGrievances(data.grievances);
      } catch (e) {
        console.error('Error fetching grievances:', e);
      }
    };
    fetchGrievances();
  }, [activeTab]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab !== 'users') return;
      try {
        const res = await fetch('/api/users/list');
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (e) {
        console.error('Error fetching users:', e);
      }
    };
    fetchUsers();
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/list');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        calculateStats(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projectList) => {
    const newStats = {
      approved: 0,
      pending: 0,
      objection: 0,
      rejected: 0
    };

    projectList.forEach(project => {
      if (project.status === 'approved') newStats.approved++;
      else if (project.status === 'pending') newStats.pending++;
      else if (project.status === 'objection') newStats.objection++;
      else if (project.status === 'rejected') newStats.rejected++;
    });

    setStats(newStats);
  };

  const handleApprove = async (projectId) => {
    try {
      const response = await fetch('/api/projects/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          action: 'approve',
          approver_id: user.id,
          current_level: user.role
        })
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error approving project:', error);
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
          current_level: user.role,
          remarks: 'Rejected by admin'
        })
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div>
          <p style={{ margin: 0 }}>Welcome, {user.full_name}</p>
          <button
            className={styles.btnPrimary}
            style={{ marginTop: 8 }}
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              router.push('/');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.approved}`}>
          <div className={styles.statNumber}>{stats.approved}</div>
          <div className={styles.statLabel}>Approved</div>
        </div>
        <div className={`${styles.statCard} ${styles.pending}`}>
          <div className={styles.statNumber}>{stats.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
        <div className={`${styles.statCard} ${styles.objection}`}>
          <div className={styles.statNumber}>{stats.objection}</div>
          <div className={styles.statLabel}>Objections</div>
        </div>
        <div className={`${styles.statCard} ${styles.rejected}`}>
          <div className={styles.statNumber}>{stats.rejected}</div>
          <div className={styles.statLabel}>Rejected</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'grievances' ? styles.active : ''}`}
          onClick={() => setActiveTab('grievances')}
        >
          Grievances
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardContent}>
            <h2>Project Overview</h2>
            <div className={styles.projectsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Project Code</th>
                    <th>Project Name</th>
                    <th>Allocated</th>
                    <th>Utilized</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.slice(0, 5).map(project => (
                    <tr key={project.id}>
                      <td>{project.project_code}</td>
                      <td>{project.project_name}</td>
                      <td>₹{Number(project.budget_allocated || 0).toLocaleString()}</td>
                      <td>₹{Number(project.budget_utilized || 0).toLocaleString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[project.status]}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.btnSmall} onClick={() => setSelectedProject(project)}>
                          View
                        </button>
                        <button className={styles.btnSmall} onClick={() => handleApprove(project.id)}>
                          Approve
                        </button>
                        <button className={styles.btnSmallDanger} onClick={() => handleReject(project.id)}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className={styles.projectsContent}>
            <h2>All Projects</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>Total Projects: {projects.length}</p>
              <button
                className={styles.btnPrimary}
                onClick={() => router.push('/admin/projects/new')}
              >
                + Create Project
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.usersContent}>
            <h2>User Management</h2>
            <button
              className={styles.btnPrimary}
              onClick={() => router.push('/admin/users/new')}
            >
              + Add New User
            </button>
            <div className={styles.projectsTable} style={{ marginTop: 20 }}>
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>District</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.user_id}</td>
                      <td>{u.full_name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.role_name || 'N/A'}</td>
                      <td>{u.district_name || 'N/A'}</td>
                      <td>
                        <span style={{ color: u.is_active ? 'green' : 'red' }}>
                          {u.is_active ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'grievances' && (
          <div className={styles.grievancesContent}>
            <h2>Grievances</h2>
            {grievances.length === 0 ? (
              <p>No grievances found.</p>
            ) : (
              <div className={styles.projectsTable}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>District</th>
                      <th>Village</th>
                      <th>Message</th>
                      <th>Attachment</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grievances.map(g => (
                      <tr key={g.id}>
                        <td>{g.grievance_id}</td>
                        <td>{g.name}</td>
                        <td>{g.district}</td>
                        <td>{g.village}</td>
                        <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.message}</td>
                        <td>
                          {g.attachment_url ? (
                            <a href={g.attachment_url} target="_blank" rel="noreferrer">📄</a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{g.status}</td>
                        <td>{new Date(g.created_at).toLocaleString()}</td>
                        <td>
                          <button className={styles.btnSmall} onClick={() => setSelectedProject({...g, isGrievance: true})}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 8,
            maxWidth: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>{selectedProject.isGrievance ? 'Grievance Details' : 'Project Details'}</h2>
              <button onClick={() => setSelectedProject(null)} style={{ fontSize: 20, border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            {selectedProject.isGrievance ? (
              <div>
                <p><strong>ID:</strong> {selectedProject.grievance_id}</p>
                <p><strong>Name:</strong> {selectedProject.name}</p>
                <p><strong>Email:</strong> {selectedProject.email}</p>
                <p><strong>Phone:</strong> {selectedProject.phone}</p>
                <p><strong>District:</strong> {selectedProject.district}</p>
                <p><strong>Village:</strong> {selectedProject.village}</p>
                <p><strong>Message:</strong> {selectedProject.message || 'No message provided'}</p>
                <p><strong>Status:</strong> {selectedProject.status}</p>
                <p><strong>Created:</strong> {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleString() : 'N/A'}</p>
                {selectedProject.attachment_url && (
                  <p><strong>Attachment:</strong> <a href={selectedProject.attachment_url} target="_blank" rel="noreferrer">📄 View File</a></p>
                )}
              </div>
            ) : (
              <div>
                <p><strong>Project Code:</strong> {selectedProject.project_code}</p>
                <p><strong>Project Name:</strong> {selectedProject.project_name}</p>
                <p><strong>Description:</strong> {selectedProject.description || 'N/A'}</p>
                <p><strong>Allocated:</strong> ₹{Number(selectedProject.budget_allocated || 0).toLocaleString()}</p>
                <p><strong>Utilized:</strong> ₹{Number(selectedProject.budget_utilized || 0).toLocaleString()}</p>
                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: selectedProject.status === 'objection' ? 'orange' : selectedProject.status === 'approved' ? 'green' : 'blue' }}>{selectedProject.status}</span></p>
                <p><strong>Created:</strong> {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedProject(null)}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
