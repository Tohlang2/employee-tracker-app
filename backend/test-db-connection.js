const mysql = require('mysql2');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'attendance_user',
  password: 'userpassword123',
  database: 'attendance_db'
};

async function testConnection() {
  console.log('🧪 Testing database connection...\n');
  
  let connection;
  try {
    connection = await mysql.createConnection(config).promise();
    console.log('✅ Connected to MySQL database successfully!');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Attendance');
    console.log(`📊 Records in table: ${rows[0].count}`);
    
    console.log('🎉 Database is ready!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

testConnection();