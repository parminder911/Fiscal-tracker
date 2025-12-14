import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.user_id, u.full_name, u.email, u.phone, u.is_active, u.role_id, u.district_id,
              r.role_name, d.name as district_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN districts d ON u.district_id = d.id
       ORDER BY u.created_at DESC`
    );

    return Response.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('List users error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
