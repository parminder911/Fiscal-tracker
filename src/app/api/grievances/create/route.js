import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const {
      user_id,
      project_id,
      title,
      description,
      attachment_url,
      priority,
      assigned_to
    } = await request.json();

    if (!user_id || !title || !description) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate grievance ID: GRV + timestamp
    const grievanceId = 'GRV' + Date.now();

    const result = await pool.query(
      `INSERT INTO grievances (
        grievance_id, user_id, project_id, title, description,
        attachment_url, status, priority, assigned_to
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        grievanceId,
        user_id,
        project_id,
        title,
        description,
        attachment_url,
        'open',
        priority || 'medium',
        assigned_to
      ]
    );

    // Create notification for assigned officer
    if (assigned_to) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, notification_type, related_project_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          assigned_to,
          'New Grievance',
          `New grievance: ${title}`,
          'grievance',
          project_id
        ]
      );
    }

    // Log audit
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, 'CREATE_GRIEVANCE', 'grievances', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    return Response.json({
      success: true,
      message: 'Grievance created successfully',
      grievance: result.rows[0]
    });
  } catch (error) {
    console.error('Create grievance error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
