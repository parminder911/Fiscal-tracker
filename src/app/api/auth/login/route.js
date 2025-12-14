import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const { user_id, password } = await request.json();

    if (!user_id || !password) {
      return Response.json(
        { error: 'User ID and password are required' },
        { status: 400 }
      );
    }

    // Try exact match first
    let userResult = await pool.query(
      `SELECT u.id, u.user_id, u.password, u.full_name, u.email, u.phone,
              u.role_id, u.district_id, u.tehsil_id, u.village_id,
              r.role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE LOWER(u.user_id) = LOWER($1) LIMIT 1`,
      [user_id]
    );

    // If not found, try alternate ID form (add/remove colon after PFT)
    if (userResult.rows.length === 0) {
      let altId = null;
      if (user_id.startsWith('PFT:')) {
        altId = user_id.replace('PFT:', 'PFT');
      } else if (user_id.startsWith('PFT') && /^PFT\d{4}$/.test(user_id)) {
        altId = user_id.replace('PFT', 'PFT:');
      }
      if (altId) {
        userResult = await pool.query(
          `SELECT u.id, u.user_id, u.password, u.full_name, u.email, u.phone,
                  u.role_id, u.district_id, u.tehsil_id, u.village_id,
                  r.role_name
           FROM users u
           LEFT JOIN roles r ON u.role_id = r.id
           WHERE LOWER(u.user_id) = LOWER($1) LIMIT 1`,
          [altId]
        );
      }
    }

    if (userResult.rows.length === 0) {
      console.warn(`Login failed: User ID "${user_id}" not found in database`);
      return Response.json(
        { 
          error: 'Invalid user ID or password',
          details: 'USER_NOT_FOUND',
          debug: { user_id: user_id }
        },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (user.is_active === false) {
      console.warn(`Login failed: User ID "${user_id}" is deactivated`);
      return Response.json(
        { 
          error: 'Account is deactivated',
          details: 'USER_INACTIVE',
          debug: { user_id: user_id }
        },
        { status: 401 }
      );
    }

    // Plain-text password comparison (DB currently stores plain passwords)
    const passwordMatch = user.password === password;

    if (!passwordMatch) {
      console.warn(`Login failed: Password mismatch for user ID "${user_id}"`);
      return Response.json(
        { 
          error: 'Invalid user ID or password',
          details: 'PASSWORD_MISMATCH',
          debug: { user_id: user_id, hasPassword: !!user.password }
        },
        { status: 401 }
      );
    }

    console.log(`Login successful: User ID "${user_id}", Role: "${user.role_name}"`);

    return Response.json({
      success: true,
      token: 'token_' + user.id + '_' + Date.now(),
      user: {
        id: user.id,
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        district_id: user.district_id,
        tehsil_id: user.tehsil_id,
        village_id: user.village_id,
        role: user.role_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}
