import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = 'SELECT id, user_id, email, role, district_id, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = $' + (params.length + 1);
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Users fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, email, password, role, districtId } = await request.json();

    if (!userId || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await pool.query(
      'INSERT INTO users (user_id, email, password, role, district_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, user_id, email, role, district_id',
      [userId, email, password, role, districtId || null]
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('User creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
