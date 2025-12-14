import { pool } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const state = formData.get('state');
    const district = formData.get('district');
    const taluka = formData.get('taluka');
    const village = formData.get('village');
    const message = formData.get('message');
    const attachment = formData.get('attachment');

    if (!name || !email || !phone || !district || !village || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate grievance ID
    const grievanceId = 'GRV' + Date.now();
    
    // Handle file upload if attachment exists
    let attachmentUrl = null;
    if (attachment && attachment.size > 0) {
      try {
        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'grievances', grievanceId);
        await mkdir(uploadDir, { recursive: true });
        
        // Save the file
        const bytes = await attachment.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${attachment.name}`;
        const filepath = join(uploadDir, filename);
        
        await writeFile(filepath, buffer);
        
        // Store relative path for database
        attachmentUrl = `/uploads/grievances/${grievanceId}/${filename}`;
        
        console.log(`File saved: ${attachmentUrl}`);
      } catch (fileError) {
        console.error('Error saving attachment:', fileError);
        // Continue without attachment if file save fails
      }
    }

    // Insert grievance into database
    const result = await pool.query(
      `INSERT INTO grievances (
        grievance_id, name, email, phone, state, district, taluka, village, 
        message, attachment_url, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        grievanceId,
        name,
        email,
        phone,
        state,
        district,
        taluka,
        village,
        message,
        attachmentUrl,
        'open'
      ]
    );

    // Log audit
    await pool.query(
      `INSERT INTO audit_log (user_id, action, entity_type, entity_id, new_values)
       VALUES ($1, $2, $3, $4, $5)`,
      [null, 'CREATE_GRIEVANCE', 'grievances', result.rows[0].id, JSON.stringify(result.rows[0])]
    );

    return Response.json({
      success: true,
      message: 'Grievance submitted successfully',
      grievance_id: grievanceId
    });
  } catch (error) {
    console.error('Submit grievance error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
