import pool from '@/lib/db';

export async function GET(request) {
  try {
    const result = await pool.query(
      'SELECT id, name, state_id FROM districts WHERE state_id = (SELECT id FROM states WHERE name = $1) ORDER BY name',
      ['Punjab']
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Districts fetch error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch districts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
