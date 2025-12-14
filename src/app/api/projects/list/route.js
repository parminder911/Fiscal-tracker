import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const district_id = searchParams.get('district_id');
    const tehsil_id = searchParams.get('tehsil_id');
    const village_id = searchParams.get('village_id');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    let query = `
      SELECT 
        p.id,
        p.project_name,
        p.project_code,
        p.description,
        p.village_id,
        p.district_id,
        p.budget_allocated,
        p.budget_utilized,
        p.status,
        v.village_name,
        d.district_name
      FROM projects p
      LEFT JOIN villages v ON p.village_id = v.id
      LEFT JOIN districts d ON p.district_id = d.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(status);
    }

    if (district_id) {
      query += ` AND p.district_id = $${params.length + 1}`;
      params.push(district_id);
    }

    if (tehsil_id) {
      query += ` AND v.tehsil_id = $${params.length + 1}`;
      params.push(tehsil_id);
    }

    if (village_id) {
      query += ` AND p.village_id = $${params.length + 1}`;
      params.push(village_id);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM projects WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ` AND status = $${countParams.length + 1}`;
      countParams.push(status);
    }

    if (district_id) {
      countQuery += ` AND district_id = $${countParams.length + 1}`;
      countParams.push(district_id);
    }

    if (tehsil_id) {
      countQuery += ` AND village_id IN (SELECT id FROM villages WHERE tehsil_id = $${countParams.length + 1})`;
      countParams.push(tehsil_id);
    }

    if (village_id) {
      countQuery += ` AND village_id = $${countParams.length + 1}`;
      countParams.push(village_id);
    }

    const countResult = await pool.query(countQuery, countParams);

    return Response.json({
      success: true,
      projects: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        pages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      }
    });
  } catch (error) {
    console.error('List projects error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
