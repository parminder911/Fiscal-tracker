import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const {
      project_name,
      description,
      village_id,
      district_id,
      total_budget
    } = await request.json();

    if (!project_name || !total_budget) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate project code: PFT + 4 random digits
    const projectCode = 'PFT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    const result = await pool.query(
      `INSERT INTO projects (
        project_name, project_code, description,
        village_id, district_id, budget_allocated, budget_utilized, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        project_name,
        projectCode,
        description,
        village_id,
        district_id,
        total_budget,
        0,
        'pending'
      ]
    );

    // Optional: create workflow if table exists (ignore errors)
    try {
      await pool.query(
        `INSERT INTO approval_workflow (project_id, current_level, current_approver_id, status)
         VALUES ($1, $2, $3, $4)`,
        [result.rows[0].id, 'sarpanch', null, 'pending']
      );
    } catch (e) {}

    // Log audit
    try {
      await pool.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, $2, $3, $4, $5)`,
        [null, 'CREATE_PROJECT', 'projects', result.rows[0].id, JSON.stringify(result.rows[0])]
      );
    } catch (e) {}

    return Response.json({
      success: true,
      message: 'Project created successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Create project error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
