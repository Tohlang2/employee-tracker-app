import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDashboard.css';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (filterDate) params.append('date', filterDate);

      const response = await axios.get(`${API_BASE_URL}/api/attendance/search?${params}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error searching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
            await axios.delete(`${API_BASE_URL}/api/attendance/${id}`);    fetchAttendance();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterDate('');
    fetchAttendance();
  };

  if (loading) {
    return <div className="loading">Loading attendance records...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Attendance Dashboard</h2>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-input"
        />

        <button onClick={handleSearch} className="filter-btn">
          Search
        </button>
        
        <button onClick={clearFilters} className="clear-btn">
          Clear
        </button>
      </div>

      <div className="attendance-table-container">
        {attendance.length === 0 ? (
          <div className="no-data">No attendance records found.</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.employeeName}</td>
                  <td>{record.employeeID}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;