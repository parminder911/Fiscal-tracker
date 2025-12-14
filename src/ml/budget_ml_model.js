/**
 * Budget Analysis ML Model - Node.js Implementation
 * Uses decision trees and statistical analysis for budget prediction
 * Integrated with Oumi GRPO fine-tuning concepts
 */

class BudgetMLModel {
  constructor() {
    this.trainingData = [];
    this.model = {
      rules: [],
      thresholds: {}
    };
    this.initializeModel();
  }

  initializeModel() {
    // Initialize budget analysis thresholds
    this.model.thresholds = {
      lowUtilization: 0.30,      // < 30% utilization = at risk
      mediumUtilization: 0.60,   // 30-60% = medium risk
      highUtilization: 0.85,     // > 85% = on track
      delayedDays: 90,           // > 90 days = delayed
      criticalDays: 120          // > 120 days = critical
    };

    // Decision rules for budget health
    this.model.rules = [
      {
        name: 'critical_delay',
        condition: (project) => project.daysApproved > this.model.thresholds.criticalDays && project.utilization < 0.20,
        status: 'CRITICAL',
        confidence: 0.95,
        recommendation: 'Immediate intervention required. Project severely delayed with minimal utilization.'
      },
      {
        name: 'delayed_low_utilization',
        condition: (project) => project.daysApproved > this.model.thresholds.delayedDays && project.utilization < this.model.thresholds.lowUtilization,
        status: 'DELAYED',
        confidence: 0.90,
        recommendation: 'Project is delayed. Investigate bottlenecks and accelerate fund utilization.'
      },
      {
        name: 'at_risk_medium_utilization',
        condition: (project) => project.daysApproved > 60 && project.utilization < this.model.thresholds.mediumUtilization,
        status: 'AT_RISK',
        confidence: 0.80,
        recommendation: 'Monitor closely. Utilization is below expected pace. Plan corrective actions.'
      },
      {
        name: 'on_track_high_utilization',
        condition: (project) => project.utilization > this.model.thresholds.highUtilization,
        status: 'ON_TRACK',
        confidence: 0.85,
        recommendation: 'Project progressing well. Continue current pace.'
      },
      {
        name: 'on_track_normal',
        condition: (project) => project.utilization >= this.model.thresholds.mediumUtilization && project.utilization <= this.model.thresholds.highUtilization,
        status: 'ON_TRACK',
        confidence: 0.75,
        recommendation: 'Project on normal track. Monitor for any deviations.'
      },
      {
        name: 'stalled_project',
        condition: (project) => project.utilization === 0 && project.daysApproved > 30,
        status: 'STALLED',
        confidence: 0.92,
        recommendation: 'Project has not started. Immediate action needed to initiate work.'
      }
    ];
  }

  /**
   * Predict project health status
   * @param {Object} project - Project data
   * @returns {Object} Prediction with status, confidence, and recommendations
   */
  predictProjectHealth(project) {
    const normalizedProject = this.normalizeProjectData(project);
    
    for (const rule of this.model.rules) {
      if (rule.condition(normalizedProject)) {
        return {
          status: rule.status,
          confidence: rule.confidence,
          recommendation: rule.recommendation,
          riskScore: this.calculateRiskScore(normalizedProject),
          suggestedActions: this.generateActions(rule.status, normalizedProject)
        };
      }
    }

    return {
      status: 'UNKNOWN',
      confidence: 0.5,
      recommendation: 'Unable to determine status. Review project details.',
      riskScore: 0.5
    };
  }

  /**
   * Normalize project data for analysis
   */
  normalizeProjectData(project) {
    const allocatedBudget = parseFloat(project.allocated_budget) || 0;
    const utilizedBudget = parseFloat(project.utilized_budget) || 0;
    const totalBudget = parseFloat(project.total_budget) || 1;
    
    const approvalDate = new Date(project.created_at);
    const daysApproved = Math.floor((Date.now() - approvalDate) / (1000 * 60 * 60 * 24));
    
    const utilization = allocatedBudget > 0 ? utilizedBudget / allocatedBudget : 0;
    const allocationRate = totalBudget > 0 ? allocatedBudget / totalBudget : 0;

    return {
      ...project,
      utilization: Math.min(utilization, 1),
      allocationRate: Math.min(allocationRate, 1),
      daysApproved: Math.max(daysApproved, 0),
      allocatedBudget,
      utilizedBudget,
      totalBudget
    };
  }

  /**
   * Calculate risk score (0-1, where 1 is highest risk)
   */
  calculateRiskScore(project) {
    let riskScore = 0;

    // Low utilization risk
    if (project.utilization < this.model.thresholds.lowUtilization) {
      riskScore += 0.4;
    } else if (project.utilization < this.model.thresholds.mediumUtilization) {
      riskScore += 0.2;
    }

    // Delay risk
    if (project.daysApproved > this.model.thresholds.criticalDays) {
      riskScore += 0.4;
    } else if (project.daysApproved > this.model.thresholds.delayedDays) {
      riskScore += 0.2;
    }

    // Allocation risk
    if (project.allocationRate < 0.5) {
      riskScore += 0.2;
    }

    return Math.min(riskScore, 1);
  }

  /**
   * Generate suggested actions based on status
   */
  generateActions(status, project) {
    const actions = [];

    switch (status) {
      case 'CRITICAL':
        actions.push('Escalate to district administration');
        actions.push('Conduct site inspection');
        actions.push('Review project constraints');
        actions.push('Allocate additional resources if needed');
        break;
      case 'DELAYED':
        actions.push('Schedule review meeting');
        actions.push('Identify bottlenecks');
        actions.push('Create action plan for acceleration');
        actions.push('Monitor weekly progress');
        break;
      case 'AT_RISK':
        actions.push('Increase monitoring frequency');
        actions.push('Review resource allocation');
        actions.push('Plan corrective measures');
        break;
      case 'ON_TRACK':
        actions.push('Continue current pace');
        actions.push('Maintain regular monitoring');
        break;
      case 'STALLED':
        actions.push('Investigate project initiation delays');
        actions.push('Remove implementation barriers');
        actions.push('Provide necessary approvals and clearances');
        actions.push('Allocate budget immediately');
        break;
    }

    return actions;
  }

  /**
   * Predict budget allocation for new projects
   * Based on historical data and project characteristics
   */
  predictBudgetAllocation(projectCharacteristics) {
    const {
      projectType,
      complexity,
      duration,
      scope,
      historicalData = []
    } = projectCharacteristics;

    // Calculate average allocation based on similar projects
    const similarProjects = historicalData.filter(p => 
      p.type === projectType && 
      Math.abs(p.duration - duration) <= 30
    );

    let recommendedAllocation = 0;
    if (similarProjects.length > 0) {
      const avgAllocation = similarProjects.reduce((sum, p) => sum + p.allocated_budget, 0) / similarProjects.length;
      recommendedAllocation = avgAllocation * (1 + (complexity - 1) * 0.1);
    }

    return {
      recommendedAllocation: Math.round(recommendedAllocation),
      confidence: Math.min(0.5 + (similarProjects.length * 0.1), 0.95),
      basedOnProjects: similarProjects.length,
      factors: {
        complexity: complexity,
        duration: duration,
        scope: scope
      }
    };
  }

  /**
   * Analyze district-level budget trends
   */
  analyzeDistrictBudgets(districtProjects) {
    const totalBudget = districtProjects.reduce((sum, p) => sum + parseFloat(p.total_budget), 0);
    const totalAllocated = districtProjects.reduce((sum, p) => sum + parseFloat(p.allocated_budget), 0);
    const totalUtilized = districtProjects.reduce((sum, p) => sum + parseFloat(p.utilized_budget), 0);

    const allocationRate = totalBudget > 0 ? totalAllocated / totalBudget : 0;
    const utilizationRate = totalAllocated > 0 ? totalUtilized / totalAllocated : 0;

    // Categorize projects
    const statusCounts = {
      on_track: 0,
      at_risk: 0,
      delayed: 0,
      critical: 0,
      stalled: 0
    };

    districtProjects.forEach(project => {
      const prediction = this.predictProjectHealth(project);
      const statusKey = prediction.status.toLowerCase().replace(/_/g, '_');
      if (statusCounts.hasOwnProperty(statusKey)) {
        statusCounts[statusKey]++;
      }
    });

    return {
      totalProjects: districtProjects.length,
      totalBudget: totalBudget,
      totalAllocated: totalAllocated,
      totalUtilized: totalUtilized,
      allocationRate: (allocationRate * 100).toFixed(2),
      utilizationRate: (utilizationRate * 100).toFixed(2),
      projectStatus: statusCounts,
      healthScore: this.calculateDistrictHealthScore(statusCounts, districtProjects.length),
      recommendations: this.generateDistrictRecommendations(statusCounts, districtProjects.length)
    };
  }

  /**
   * Calculate overall district health score (0-100)
   */
  calculateDistrictHealthScore(statusCounts, totalProjects) {
    if (totalProjects === 0) return 0;

    const weights = {
      on_track: 20,
      at_risk: -10,
      delayed: -15,
      critical: -25,
      stalled: -20
    };

    let score = 50; // Base score
    for (const [status, count] of Object.entries(statusCounts)) {
      score += (count / totalProjects) * weights[status];
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendations for district
   */
  generateDistrictRecommendations(statusCounts, totalProjects) {
    const recommendations = [];

    const criticalPercentage = (statusCounts.critical / totalProjects) * 100;
    const delayedPercentage = (statusCounts.delayed / totalProjects) * 100;
    const atRiskPercentage = (statusCounts.at_risk / totalProjects) * 100;

    if (criticalPercentage > 10) {
      recommendations.push('HIGH PRIORITY: Multiple critical projects. Immediate intervention required.');
    }

    if (delayedPercentage > 20) {
      recommendations.push('URGENT: Over 20% of projects are delayed. Review implementation strategy.');
    }

    if (atRiskPercentage > 30) {
      recommendations.push('CAUTION: Over 30% of projects at risk. Increase monitoring and support.');
    }

    if (statusCounts.stalled > 0) {
      recommendations.push(`ACTION: ${statusCounts.stalled} project(s) stalled. Initiate immediately.`);
    }

    if (statusCounts.on_track > (totalProjects * 0.7)) {
      recommendations.push('POSITIVE: Over 70% of projects on track. Maintain current pace.');
    }

    return recommendations;
  }

  /**
   * Train model with historical data (for GRPO fine-tuning simulation)
   */
  trainModel(trainingData) {
    this.trainingData = trainingData;
    
    // Simulate GRPO fine-tuning by adjusting thresholds based on data
    const utilizationRates = trainingData.map(d => {
      const allocated = parseFloat(d.allocated_budget) || 0;
      const utilized = parseFloat(d.utilized_budget) || 0;
      return allocated > 0 ? utilized / allocated : 0;
    });

    const avgUtilization = utilizationRates.reduce((a, b) => a + b, 0) / utilizationRates.length;
    const stdDev = Math.sqrt(
      utilizationRates.reduce((sum, rate) => sum + Math.pow(rate - avgUtilization, 2), 0) / utilizationRates.length
    );

    // Adjust thresholds based on training data
    this.model.thresholds.lowUtilization = Math.max(0.1, avgUtilization - stdDev);
    this.model.thresholds.mediumUtilization = avgUtilization;
    this.model.thresholds.highUtilization = Math.min(1, avgUtilization + stdDev);

    return {
      trainingDataPoints: trainingData.length,
      avgUtilization: (avgUtilization * 100).toFixed(2),
      stdDeviation: (stdDev * 100).toFixed(2),
      updatedThresholds: this.model.thresholds
    };
  }
}

module.exports = BudgetMLModel;
