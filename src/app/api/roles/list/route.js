import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT id, role_name FROM roles ORDER BY id ASC');
    return Response.json({ success: true, roles: result.rows });
  } catch (error) {
    console.error('List roles error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
