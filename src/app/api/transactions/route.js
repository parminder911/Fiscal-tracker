import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (districtId) {
      query += ' AND district_id = $' + (params.length + 1);
      params.push(districtId);
    }

    if (status) {
      query += ' AND status = $' + (params.length + 1);
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, params);

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch transactions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    const { districtId, amount, description, type } = await request.json();

    if (!districtId || !amount || !description || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await pool.query(
      'INSERT INTO transactions (district_id, amount, description, type, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [districtId, amount, description, type, 'pending']
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Transaction creation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create transaction' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
