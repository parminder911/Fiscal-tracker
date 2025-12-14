import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await pool.query(
      `SELECT id, district_name, state FROM districts ORDER BY district_name ASC`
    );

    return Response.json({
      success: true,
      districts: result.rows
    });
  } catch (error) {
    console.error('List districts error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
