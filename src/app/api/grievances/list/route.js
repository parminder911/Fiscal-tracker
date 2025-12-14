import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const district = searchParams.get('district');
    const village = searchParams.get('village');

    let query = `SELECT id, grievance_id, name, email, phone, district, village, status, created_at
                 FROM grievances WHERE 1=1`;
    const params = [];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    if (district) {
      query += ` AND district = $${params.length + 1}`;
      params.push(district);
    }
    if (village) {
      query += ` AND village = $${params.length + 1}`;
      params.push(village);
    }

    query += ' ORDER BY created_at DESC LIMIT 200';

    const result = await pool.query(query, params);

    return Response.json({ success: true, grievances: result.rows });
  } catch (error) {
    console.error('List grievances error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
