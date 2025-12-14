import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const {
      project_id,
      action,
      remarks,
      attachment_url,
      approver_id,
      current_level
    } = await request.json();

    if (!project_id || !action || !approver_id) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Valid actions: approve, reject, object
    const validActions = ['approve', 'reject', 'object', 'forward'];
    if (!validActions.includes(action)) {
      return Response.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Decide target status upfront
    let projectStatus = 'pending';
    if (action === 'approve') projectStatus = 'approved';
    else if (action === 'reject') projectStatus = 'rejected';
    else if (action === 'object') projectStatus = 'objection';

    let nextLevel = null;

    // Try the workflow path; fall back if tables are missing
    try {
      // Get current workflow
      const workflowResult = await pool.query(
        'SELECT * FROM approval_workflow WHERE project_id = $1 ORDER BY id DESC LIMIT 1',
        [project_id]
      );

      if (workflowResult.rows.length > 0) {
        const currentWorkflow = workflowResult.rows[0];

        // Add to history
        await pool.query(
          `INSERT INTO approval_history (project_id, level, approver_id, action, remarks, attachment_url, action_date)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [project_id, current_level, approver_id, action, remarks, attachment_url]
        );

        // Determine next level based on action and current level (only for approve)
        if (action === 'approve') {
          if (current_level === 'sarpanch') nextLevel = 'tehsil';
          else if (current_level === 'tehsil') nextLevel = 'district';
          else if (current_level === 'district') nextLevel = 'admin';
        }

        const newStatus = nextLevel ? 'pending' : projectStatus;

        // Update approval workflow
        if (nextLevel) {
          await pool.query(
            `UPDATE approval_workflow 
             SET current_level = $1, status = $2, updated_at = NOW()
             WHERE id = $3`,
            [nextLevel, newStatus, currentWorkflow.id]
          );
        } else {
          await pool.query(
            `UPDATE approval_workflow 
             SET status = $1, updated_at = NOW()
             WHERE id = $2`,
            [newStatus, currentWorkflow.id]
          );
        }

        // Create notification for next level
        if (nextLevel) {
          await pool.query(
            `INSERT INTO notifications (user_id, title, message, notification_type, related_project_id)
             SELECT u.id, 'New Project Approval', 'A project requires your approval', 'approval', $1
             FROM users u WHERE u.role_id = (SELECT id FROM roles WHERE role_name = $2)
             LIMIT 1`,
            [project_id, nextLevel]
          );
        }
      }
    } catch (wfErr) {
      // If relation missing (42P01) or any workflow error, ignore and proceed to direct update
    }

    // Update project status regardless of workflow availability
    await pool.query(
      'UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2',
      [projectStatus, project_id]
    );

    // Log audit (best-effort)
    try {
      await pool.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, $2, $3, $4, $5)`,
        [approver_id, `PROJECT_${action.toUpperCase()}`, 'projects', project_id, JSON.stringify({ action, remarks })]
      );
    } catch (e) {}

    return Response.json({
      success: true,
      message: `Project ${action}ed successfully`,
      nextLevel,
      projectStatus
    });
  } catch (error) {
    console.error('Approval error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
