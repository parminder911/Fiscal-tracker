import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return new Response(
        JSON.stringify({ error: 'User ID and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await pool.query(
      'SELECT id, user_id, role FROM users WHERE user_id = $1 AND password = $2',
      [userId, password]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = result.rows[0];
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          userId: user.user_id,
          role: user.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
