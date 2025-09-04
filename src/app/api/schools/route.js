import { NextResponse } from 'next/server';
import pool, { initializeDatabase } from '../../../lib/database';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Cloudinary config (only load in production)
let cloudinary = null;
if (process.env.NODE_ENV === 'production') {
  const { v2 } = require('cloudinary');
  cloudinary = v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

let dbInitialized = false;

async function ensureDatabase() {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }
}

export async function GET() {
  try {
    await ensureDatabase();
    const [rows] = await pool.execute('SELECT * FROM schools ORDER BY created_at DESC');
    return NextResponse.json({ schools: rows });
  } 
  catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureDatabase();

    const formData = await request.formData();

    const name = formData.get('name');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const contact = formData.get('contact');
    const email_id = formData.get('email_id');
    const image = formData.get('image');

    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json(
        { error: 'All fields except image are required' },
        { status: 400 }
      );
    }

    let imageName = null;

    if (image && image.size > 0) {
      if (image.size > 5000000) {
        return NextResponse.json(
          { error: 'Image size must be less than 5MB' },
          { status: 400 }
        );
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (process.env.NODE_ENV === 'production') {
        // Production: Use Cloudinary
        try {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                  resource_type: "auto",
                  folder: "school-images",
                  public_id: `school_${Date.now()}`,
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
            ).end(buffer);
          });

          imageName = result.secure_url;
          console.log('✅ Image uploaded to Cloudinary');
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          imageName = null;
        }
      } 
      else {
        // Development: Save to public/schoolImages
        const timestamp = Date.now();
        const extension = path.extname(image.name);
        imageName = `${timestamp}_${path.basename(image.name, extension)}${extension}`;

        const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
        await mkdir(uploadDir, { recursive: true });

        const imagePath = path.join(uploadDir, imageName);
        await writeFile(imagePath, buffer);
        console.log('✅ Image saved locally');
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, email_id, imageName]
    );

    return NextResponse.json({
      message: 'School added successfully',
      schoolId: result.insertId
    }, { status: 201 });

  } 
  catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add school: ' + error.message },
      { status: 500 }
    );
  }
}

