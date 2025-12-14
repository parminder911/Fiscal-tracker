'use client';

import { useState, useEffect } from 'react';
import styles from './CitizenDashboard.module.css';

export default function CitizenDashboard() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistricts();
    fetchBudgetSummary();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts');
      const data = await response.json();
      if (data.success) {
        setDistricts(data.districts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchBudgetSummary = async () => {
    try {
      const response = await fetch('/api/budget/summary');
      const data = await response.json();
      if (data.success) {
        setBudgetSummary(data.summary);
        setAiAnalysis(data.aiAnalysis);
      }
    } catch (error) {
      console.error('Error fetching budget summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictClick = async (districtId) => {
    setSelectedDistrict(districtId);
    // Fetch district-specific analysis
    try {
      const response = await fetch('/api/budget/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district_id: districtId,
          analysis_type: 'district'
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiAnalysis(data.data.analysis);
      }
    } catch (error) {
      console.error('Error fetching district analysis:', error);
    }
  };

  return (
    <div className={styles.citizenContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Punjab Budget Transparency Portal</h1>
          <p>Know where your tax money goes</p>
        </div>
      </div>

      {/* Summary Cards */}
      {budgetSummary && (
        <div className={styles.summarySection}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>💰</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Total Budget</div>
                <div className={styles.cardValue}>
                  ₹{(budgetSummary.total_budget / 10000000).toFixed(2)}Cr
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>📊</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Allocated</div>
                <div className={styles.cardValue}>
                  ₹{(budgetSummary.total_allocated / 10000000).toFixed(2)}Cr
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>✅</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Utilized</div>
                <div className={styles.cardValue}>
                  ₹{(budgetSummary.total_utilized / 10000000).toFixed(2)}Cr
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.cardIcon}>⏳</div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>Pending</div>
                <div className={styles.cardValue}>
                  ₹{(budgetSummary.total_pending / 10000000).toFixed(2)}Cr
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <div className={styles.analysisSection}>
          <h2>AI-Powered Budget Analysis</h2>
          <div className={styles.analysisCard}>
            <p className={styles.analysisText}>{aiAnalysis}</p>
          </div>
        </div>
      )}

      {/* Districts Section */}
      <div className={styles.districtsSection}>
        <h2>Punjab Districts - Budget Overview</h2>
        <div className={styles.districtsGrid}>
          {districts.map(district => (
            <div
              key={district.id}
              className={`${styles.districtCard} ${selectedDistrict === district.id ? styles.selected : ''}`}
              onClick={() => handleDistrictClick(district.id)}
            >
              <div className={styles.districtName}>{district.district_name}</div>
              <div className={styles.districtInfo}>
                <span className={styles.infoLabel}>Click for details</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected District Details */}
      {selectedDistrict && aiAnalysis && (
        <div className={styles.detailsSection}>
          <h2>District Analysis</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>Total Projects</div>
              <div className={styles.detailValue}>{aiAnalysis.totalProjects}</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>Allocation Rate</div>
              <div className={styles.detailValue}>{aiAnalysis.allocationRate}%</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>Utilization Rate</div>
              <div className={styles.detailValue}>{aiAnalysis.utilizationRate}%</div>
            </div>
            <div className={styles.detailCard}>
              <div className={styles.detailLabel}>Health Score</div>
              <div className={styles.detailValue}>{aiAnalysis.healthScore.toFixed(0)}/100</div>
            </div>
          </div>

          {/* Recommendations */}
          {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
            <div className={styles.recommendationsSection}>
              <h3>AI Recommendations</h3>
              <ul className={styles.recommendationsList}>
                {aiAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Growth Indicator */}
      <div className={styles.growthSection}>
        <h2>Budget Growth Indicator</h2>
        <div className={styles.growthCard}>
          <div className={styles.growthMetric}>
            <div className={styles.growthLabel}>Expected GSDP Growth</div>
            <div className={styles.growthValue}>10%</div>
            <div className={styles.growthStatus}>✓ On Target</div>
          </div>
          <div className={styles.growthMetric}>
            <div className={styles.growthLabel}>Fiscal Deficit Target</div>
            <div className={styles.growthValue}>3.8%</div>
            <div className={styles.growthStatus}>✓ Healthy</div>
          </div>
          <div className={styles.growthMetric}>
            <div className={styles.growthLabel}>Budget Utilization</div>
            <div className={styles.growthValue}>
              {budgetSummary ? ((budgetSummary.total_utilized / budgetSummary.total_allocated) * 100).toFixed(1) : '0'}%
            </div>
            <div className={styles.growthStatus}>✓ Progressing</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className={styles.infoSection}>
        <h3>About This Portal</h3>
        <p>
          This portal provides transparent access to Punjab's government budget allocation and utilization data.
          All information is updated regularly and analyzed using AI to provide insights into budget health and growth.
        </p>
        <p>
          <strong>Data Source:</strong> Punjab Finance Department | <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
