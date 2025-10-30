const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// POST - Add attendance
router.post('/', async (req, res) => {
  const { employeeName, employeeID, date, status } = req.body;

  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Present or Absent' });
  }

  try {
    const query = `
      INSERT INTO Attendance (employeeName, employeeID, date, status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [employeeName, employeeID, date, status]);
    
    res.status(201).json({
      message: 'Attendance record added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save attendance record' });
  }
});

// GET - Retrieve all attendance
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT * FROM Attendance 
      ORDER BY date DESC, createdAt DESC
    `;

    const [rows] = await pool.execute(query);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// DELETE - Remove attendance
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM Attendance WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// GET - Search attendance
router.get('/search', async (req, res) => {
  const { query, date } = req.query;
  
  try {
    let sql = 'SELECT * FROM Attendance WHERE 1=1';
    const params = [];

    if (query) {
      sql += ' AND (employeeName LIKE ? OR employeeID LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }

    sql += ' ORDER BY date DESC, createdAt DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to search attendance records' });
  }
});

module.exports = router;