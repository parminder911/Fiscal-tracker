import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    // Get overall budget summary
    const summaryResult = await pool.query(
      `SELECT 
        SUM(total_budget) as total_budget,
        SUM(allocated_budget) as total_allocated,
        SUM(utilized_budget) as total_utilized,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'objection' THEN 1 END) as objection_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
      FROM projects`
    );

    const summary = summaryResult.rows[0];

    // Calculate pending and rejected amounts
    const pendingResult = await pool.query(
      `SELECT SUM(total_budget) as total FROM projects WHERE status = 'pending'`
    );

    const rejectedResult = await pool.query(
      `SELECT SUM(total_budget) as total FROM projects WHERE status = 'rejected'`
    );

    const pendingAmount = pendingResult.rows[0].total || 0;
    const rejectedAmount = rejectedResult.rows[0].total || 0;

    // Generate AI analysis
    const totalBudget = parseFloat(summary.total_budget) || 0;
    const totalAllocated = parseFloat(summary.total_allocated) || 0;
    const totalUtilized = parseFloat(summary.total_utilized) || 0;

    const allocationRate = totalBudget > 0 ? (totalAllocated / totalBudget) * 100 : 0;
    const utilizationRate = totalAllocated > 0 ? (totalUtilized / totalAllocated) * 100 : 0;

    let aiAnalysis = '';

    if (utilizationRate > 80) {
      aiAnalysis = `Excellent budget utilization at ${utilizationRate.toFixed(1)}%. Projects are progressing well with strong momentum. Continue current pace and maintain oversight.`;
    } else if (utilizationRate > 60) {
      aiAnalysis = `Good budget utilization at ${utilizationRate.toFixed(1)}%. Most projects are on track. Monitor for any deviations and provide support where needed.`;
    } else if (utilizationRate > 40) {
      aiAnalysis = `Moderate budget utilization at ${utilizationRate.toFixed(1)}%. Some projects need attention. Identify bottlenecks and accelerate fund utilization.`;
    } else {
      aiAnalysis = `Low budget utilization at ${utilizationRate.toFixed(1)}%. Immediate action required. Review project constraints and provide necessary support.`;
    }

    return Response.json({
      success: true,
      summary: {
        total_budget: totalBudget,
        total_allocated: totalAllocated,
        total_utilized: totalUtilized,
        total_pending: pendingAmount,
        total_objections: 0,
        total_rejected: rejectedAmount,
        allocation_rate: allocationRate.toFixed(2),
        utilization_rate: utilizationRate.toFixed(2),
        project_counts: {
          approved: summary.approved_count,
          pending: summary.pending_count,
          objection: summary.objection_count,
          rejected: summary.rejected_count
        }
      },
      aiAnalysis: aiAnalysis
    });
  } catch (error) {
    console.error('Budget summary error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
