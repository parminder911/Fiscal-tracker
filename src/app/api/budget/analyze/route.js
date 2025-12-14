import { pool } from '@/lib/db';
import BudgetMLModel from '@/ml/budget_ml_model';

const mlModel = new BudgetMLModel();

export async function POST(request) {
  try {
    const { project_id, district_id, analysis_type } = await request.json();

    if (analysis_type === 'project' && !project_id) {
      return Response.json(
        { error: 'project_id required for project analysis' },
        { status: 400 }
      );
    }

    if (analysis_type === 'district' && !district_id) {
      return Response.json(
        { error: 'district_id required for district analysis' },
        { status: 400 }
      );
    }

    let result;

    if (analysis_type === 'project') {
      // Single project health prediction
      const projectResult = await pool.query(
        `SELECT p.*, v.village_name, d.district_name, t.tehsil_name
         FROM projects p
         LEFT JOIN villages v ON p.village_id = v.id
         LEFT JOIN districts d ON p.district_id = d.id
         LEFT JOIN tehsils t ON p.tehsil_id = t.id
         WHERE p.id = $1`,
        [project_id]
      );

      if (projectResult.rows.length === 0) {
        return Response.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      const project = projectResult.rows[0];
      const prediction = mlModel.predictProjectHealth(project);

      result = {
        type: 'project',
        projectId: project.id,
        projectName: project.project_name,
        projectCode: project.project_code,
        prediction: prediction,
        budgetInfo: {
          totalBudget: project.total_budget,
          allocatedBudget: project.allocated_budget,
          utilizedBudget: project.utilized_budget,
          utilizationPercentage: ((project.utilized_budget / project.allocated_budget) * 100).toFixed(2)
        },
        location: {
          village: project.village_name,
          district: project.district_name,
          tehsil: project.tehsil_name
        }
      };
    } else if (analysis_type === 'district') {
      // District-level analysis
      const projectsResult = await pool.query(
        `SELECT p.* FROM projects p
         WHERE p.district_id = $1`,
        [district_id]
      );

      const districtResult = await pool.query(
        'SELECT district_name FROM districts WHERE id = $1',
        [district_id]
      );

      if (districtResult.rows.length === 0) {
        return Response.json(
          { error: 'District not found' },
          { status: 404 }
        );
      }

      const analysis = mlModel.analyzeDistrictBudgets(projectsResult.rows);

      result = {
        type: 'district',
        districtId: district_id,
        districtName: districtResult.rows[0].district_name,
        analysis: analysis
      };
    }

    // Log analysis
    await pool.query(
      `INSERT INTO audit_log (action, entity_type, entity_id, new_values)
       VALUES ($1, $2, $3, $4)`,
      [
        'BUDGET_ANALYSIS',
        analysis_type,
        analysis_type === 'project' ? project_id : district_id,
        JSON.stringify(result)
      ]
    );

    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Budget analysis error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
