import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const district_id = searchParams.get('district_id');

    let query = 'SELECT id, tehsil_name, district_id FROM tehsils WHERE 1=1';
    const params = [];

    if (district_id) {
      query += ` AND district_id = $${params.length + 1}`;
      params.push(district_id);
    }

    query += ' ORDER BY tehsil_name ASC';

    const result = await pool.query(query, params);
    return Response.json({ success: true, tehsils: result.rows });
  } catch (error) {
    console.error('List tehsils error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
