const mysql = require('mysql2/promise');

// Get database URL from Railway environment variable
const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

let dbConfig;

if (databaseUrl) {
  // Parse DATABASE_URL from Railway (format: mysql://user:pass@host:port/db)
  const url = new URL(databaseUrl);
  dbConfig = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Fallback to local development
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'attendance_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and table
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');

    // Create attendance table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Attendance table is ready');

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection test: PASSED');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test: FAILED:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};