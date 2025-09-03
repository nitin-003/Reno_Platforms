import mysql from "mysql2/promise";

// Debug: Log environment variables (remove later in production)
console.log("🔍 Database Configuration Debug:");
console.log("DB_HOST:", process.env.DB_HOST || "MISSING");
console.log("DB_USER:", process.env.DB_USER || "MISSING");
console.log(
  "DB_PASSWORD:",
  process.env.DB_PASSWORD ? "✅ Present" : "❌ MISSING"
);
console.log("DB_NAME:", process.env.DB_NAME || "MISSING");

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database and create table
export async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");

    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
    );
    console.log("✅ Database created/exists");
    await connection.end();

    // Create schools table
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

    console.log("✅ Schools table created/exists");
    console.log("✅ Database initialized successfully");
  } 
  catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
}

export default pool;


