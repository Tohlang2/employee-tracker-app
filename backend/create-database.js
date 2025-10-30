const mysql = require('mysql2');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'tohlang2001@'
};

async function createDatabase() {
  let connection;
  
  try {
    console.log('🔧 Creating database...');
    
    connection = await mysql.createConnection(config).promise();
    console.log('✅ Connected to MySQL server');

    await connection.execute('CREATE DATABASE IF NOT EXISTS attendance_db');
    console.log('✅ Database created');

    await connection.execute("CREATE USER IF NOT EXISTS 'attendance_user'@'localhost' IDENTIFIED BY 'userpassword123'");
    console.log('✅ User created');

    await connection.execute("GRANT ALL PRIVILEGES ON attendance_db.* TO 'attendance_user'@'localhost'");
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createDatabase();