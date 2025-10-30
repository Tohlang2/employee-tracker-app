const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const attendanceRoutes = require('./routes/attendance');
const { initializeDatabase, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration for production
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://your-app-name.up.railway.app' // We'll update this later
  ].filter(Boolean),
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({ 
      status: 'OK', 
      message: 'Employee Attendance Tracker API',
      database: dbStatus ? 'Connected' : 'Disconnected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server error',
      database: 'Disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Employee Attendance Tracker API',
    version: '2.0.0',
    database: 'MySQL',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      attendance: {
        getAll: 'GET /api/attendance',
        create: 'POST /api/attendance',
        search: 'GET /api/attendance/search',
        delete: 'DELETE /api/attendance/:id'
      }
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Employee Attendance Tracker API',
    version: '2.0.0',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Employee Attendance Tracker Server...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
      console.log(`💾 Database: ${process.env.DB_NAME || 'attendance_db'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('💡 Make sure your MySQL database is running and accessible');
    process.exit(1);
  }
}

startServer();