import mysql from 'mysql2/promise';

// Create connection pool with better error handling
const createPool = () => {
  try {
    // Check if we have a single DATABASE_URL (for cloud databases)
    if (process.env.DATABASE_URL) {
      console.log('🔗 Using DATABASE_URL connection');
      return mysql.createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        // SSL configuration for production
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false
        } : false
      });
  }
    else {
      // Use individual environment variables (for local development)
      console.log('🔗 Using individual DB connection variables');
      console.log('DB_HOST:', process.env.DB_HOST || 'MISSING');
      console.log('DB_USER:', process.env.DB_USER || 'MISSING');
      console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ Present' : '❌ MISSING');
      console.log('DB_NAME:', process.env.DB_NAME || 'MISSING');

      return mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_management',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
        // SSL configuration
        ssl: process.env.DB_SSL === 'true' ? {
          rejectUnauthorized: false
        } : false
      });
    }
  } catch (error) {
    console.error('❌ Pool creation failed:', error);
    throw error;
  }
};

const pool = createPool();

// Initialize database and create table
export async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');

    // Test connection first
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();

    // For DATABASE_URL connections, database usually exists
    // Only try to create database for individual variable connections
    if (!process.env.DATABASE_URL) {
      try {
        const tempConnection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          port: process.env.DB_PORT || 3306,
          ssl: process.env.DB_SSL === 'true' ? {
            rejectUnauthorized: false
          } : false
        });

        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'school_management'}\``);
        console.log('✅ Database created/verified');
        await tempConnection.end();
      } 
      catch (dbError) {
        console.log('ℹ️ Database creation skipped (may already exist or using cloud database)');
      }
    }

    // Create schools table (this should work for both local and cloud)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact BIGINT NOT NULL,
        image TEXT,
        email_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Schools table created/verified');
    console.log('✅ Database initialization completed successfully');
    
  } 
  catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    connection.release();
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export default pool;



