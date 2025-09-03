import { NextRequest, NextResponse } from 'next/server';
import pool, { initializeDatabase } from '../../../lib/database';
import { writeFile } from 'fs/promises';
import path from 'path';

// Initialize database on startup
initializeDatabase().catch(console.error);

export async function GET() {
  try {
    const [rows] = await pool.execute('SELECT * FROM schools ORDER BY created_at DESC');
    return NextResponse.json({ schools: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const contact = formData.get('contact');
    const email_id = formData.get('email_id');
    const image = formData.get('image');

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All fields except image are required' },
        { status: 400 }
      );
    }

    let imageName = null;

    // Handle image upload if provided
    if (image && image.size > 0) {
      // Validate image size (5MB limit)
      if (image.size > 5000000) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = image.name;
      const extension = path.extname(originalName);
      imageName = `${timestamp}_${path.basename(originalName, extension)}${extension}`;

      // Convert image to buffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save to public/schoolImages directory
      const imagePath = path.join(process.cwd(), 'public', 'schoolImages', imageName);
      await writeFile(imagePath, buffer);
    }

    // Insert into database
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, email_id, imageName]
    );

    return NextResponse.json({ 
      message: 'School added successfully', 
      schoolId: result.insertId 
    }, { status: 201 });

  } 
  catch (error){
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add school' },
      { status: 500 }
    );
  }
}


