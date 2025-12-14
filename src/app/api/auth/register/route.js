import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const {
      user_id,
      password,
      full_name,
      email,
      phone,
      role,
      district_id,
      tehsil_id,
      village_id
    } = await request.json();

    // Validation (user_id will be generated)
    if (!password || !full_name || !role) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get role_id from role name
    const roleResult = await pool.query(
      'SELECT id FROM roles WHERE role_name = $1',
      [role]
    );

    if (roleResult.rows.length === 0) {
      return Response.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const role_id = roleResult.rows[0].id;

    // Always generate user_id: PFT: + 4-digit unique number
    let finalUserId = null;
    for (let i = 0; i < 10; i++) {
      const candidate = 'PFT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const check = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [candidate]);
      if (check.rows.length === 0) {
        finalUserId = candidate;
        break;
      }
    }
    if (!finalUserId) {
      return Response.json({ error: 'Failed to generate unique user ID' }, { status: 500 });
    }

    // Store plain password for now (bcrypt not installed)
    const hashedPassword = password;

    // Insert user
    // Coerce optional integers to null
    const toIntOrNull = (v) => (v === undefined || v === null || v === '' ? null : parseInt(v, 10));

    const result = await pool.query(
      `INSERT INTO users (
        user_id, password, full_name, email, phone, role_id,
        district_id, tehsil_id, village_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, user_id, full_name, role_id, email`,
      [
        finalUserId,
        hashedPassword,
        full_name,
        email,
        phone,
        role_id,
        toIntOrNull(district_id),
        toIntOrNull(tehsil_id),
        toIntOrNull(village_id)
      ]
    );

    // Log audit
    // Optional audit: if creator not available, log minimal info
    try {
      await pool.query(
        `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
         VALUES ($1, $2, $3, $4, $5)`
        , [null, 'CREATE_USER', 'users', result.rows[0].id, JSON.stringify(result.rows[0])]
      );
    } catch (e) {
      // ignore if audit_log not available or user_id null constraints
    }

    return Response.json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
