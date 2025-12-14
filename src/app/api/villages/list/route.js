import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const district_id = searchParams.get('district_id');
    const tehsil_id = searchParams.get('tehsil_id');

    let query = 'SELECT id, village_name, tehsil_id, district_id FROM villages WHERE 1=1';
    const params = [];

    if (district_id) {
      query += ` AND district_id = $${params.length + 1}`;
      params.push(district_id);
    }
    if (tehsil_id) {
      query += ` AND tehsil_id = $${params.length + 1}`;
      params.push(tehsil_id);
    }

    query += ' ORDER BY village_name ASC';

    const result = await pool.query(query, params);
    return Response.json({ success: true, villages: result.rows });
  } catch (error) {
    console.error('List villages error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
