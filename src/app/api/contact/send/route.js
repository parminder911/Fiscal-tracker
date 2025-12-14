import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert contact message into database
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, email, phone || null, subject, message, 'new']
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, $2, $3, $4, $5)`,
      [null, 'CREATE_CONTACT_MESSAGE', 'contact_messages', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    return Response.json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Send contact message error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
