import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Footer from './components/Footer';
import './App.css';

// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || ''  // Use environment variable in production
  : 'http://localhost:5001';  // Local development

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1>Employee Attendance Tracker</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Attendance Form</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AttendanceForm />} />
            <Route path="/dashboard" element={<AttendanceDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;