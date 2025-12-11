'use client';

import React, { useState } from 'react';
import { mockVillages, calculateDistrictSummary, getProjectHealth } from '@/data/mockData';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [selectedVillage, setSelectedVillage] = useState(mockVillages[0]);
  const summary = calculateDistrictSummary(mockVillages);

  return (
    <div className={styles.dashboard}>
      <div className="container-fluid py-5">
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className={`card ${styles.summaryCard}`}>
              <div className="card-body">
                <h6 className="card-title text-muted">Total Allocated</h6>
                <h3 className={styles.amount}>₹{(summary.totalAllocated / 100000).toFixed(2)}L</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className={`card ${styles.summaryCard}`}>
              <div className="card-body">
                <h6 className="card-title text-muted">Total Utilized</h6>
                <h3 className={styles.amount}>₹{(summary.totalUtilized / 100000).toFixed(2)}L</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className={`card ${styles.summaryCard}`}>
              <div className="card-body">
                <h6 className="card-title text-muted">Utilization %</h6>
                <h3 className={styles.amount}>{summary.utilizationPercentage}%</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className={`card ${styles.summaryCard}`}>
              <div className="card-body">
                <h6 className="card-title text-muted">Total Projects</h6>
                <h3 className={styles.amount}>{summary.projectCount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className={`card ${styles.statusCard}`}>
              <div className="card-body">
                <h5 className="card-title mb-3">Project Status Overview</h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className={styles.statusItem}>
                      <span className={`${styles.badge} ${styles.onTrack}`}>✓</span>
                      <div>
                        <p className="mb-0">On Track</p>
                        <h4>{summary.statusCount['On Track']}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={styles.statusItem}>
                      <span className={`${styles.badge} ${styles.atRisk}`}>!</span>
                      <div>
                        <p className="mb-0">At Risk</p>
                        <h4>{summary.statusCount['At Risk']}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={styles.statusItem}>
                      <span className={`${styles.badge} ${styles.delayed}`}>✕</span>
                      <div>
                        <p className="mb-0">Delayed</p>
                        <h4>{summary.statusCount['Delayed']}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Villages and Projects */}
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className={`card ${styles.villageList}`}>
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Villages</h5>
              </div>
              <div className="list-group list-group-flush">
                {mockVillages.map(village => (
                  <button
                    key={village.id}
                    className={`list-group-item list-group-item-action ${
                      selectedVillage.id === village.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedVillage(village)}
                  >
                    <h6 className="mb-1">{village.name}</h6>
                    <small className="text-muted">{village.district}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`card ${styles.projectsCard}`}>
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Projects in {selectedVillage.name}</h5>
              </div>
              <div className="card-body">
                {selectedVillage.projects.map(project => (
                  <div key={project.id} className={styles.projectItem}>
                    <div className="row align-items-center mb-3">
                      <div className="col-md-6">
                        <h6 className="mb-1">{project.name}</h6>
                        <small className="text-muted">{project.department}</small>
                      </div>
                      <div className="col-md-6 text-end">
                        <span className={`badge ${styles[`status${project.status.replace(/\s/g, '')}`]}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-md-6">
                        <small className="text-muted">Allocated: ₹{(project.allocatedBudget / 100000).toFixed(2)}L</small>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted">Utilized: ₹{(project.utilizedBudget / 100000).toFixed(2)}L</small>
                      </div>
                    </div>

                    <div className="progress mb-3" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${((project.utilizedBudget / project.allocatedBudget) * 100).toFixed(0)}%`
                        }}
                      ></div>
                    </div>

                    <small className="text-muted">
                      {((project.utilizedBudget / project.allocatedBudget) * 100).toFixed(1)}% Utilized | 
                      {project.daysApproved} days since approval
                    </small>

                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
