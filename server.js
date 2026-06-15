require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ================== HEALTH CHECK ==================
app.get('/', (req, res) => {
  res.json({
    message: 'Swiss International Cadet College API is running',
    principal: 'Hafiz Muhammad',
    creators: ['Hasnain', 'Bilal Azam']
  });
});

// ================== TEACHERS ==================

// Get all teachers
app.get('/api/teachers', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM teachers ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a teacher
app.post('/api/teachers', (req, res) => {
  try {
    const { name, subject, class: cls, contact, qualification } = req.body;
    if (!name || !subject) {
      return res.status(400).json({ error: 'Name and subject are required' });
    }
    const stmt = db.prepare(
      'INSERT INTO teachers (name, subject, class, contact, qualification) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(name, subject, cls || '', contact || '', qualification || '');
    const newTeacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a teacher
app.put('/api/teachers/:id', (req, res) => {
  try {
    const { name, subject, class: cls, contact, qualification } = req.body;
    const stmt = db.prepare(
      'UPDATE teachers SET name=?, subject=?, class=?, contact=?, qualification=? WHERE id=?'
    );
    const info = stmt.run(name, subject, cls || '', contact || '', qualification || '', req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Teacher not found' });
    const updated = db.prepare('SELECT * FROM teachers WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a teacher
app.delete('/api/teachers/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ message: 'Teacher removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== ATTENDANCE ==================

app.get('/api/attendance', (req, res) => {
  try {
    const { class: cls, date } = req.query;
    let query = 'SELECT * FROM attendance';
    const conditions = [];
    const params = [];
    if (cls) { conditions.push('class = ?'); params.push(cls); }
    if (date) { conditions.push('date = ?'); params.push(date); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY date DESC, id DESC';
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { student_name, class: cls, date, status } = req.body;
    if (!student_name || !date || !status) {
      return res.status(400).json({ error: 'student_name, date and status are required' });
    }
    if (!['Present', 'Absent', 'Leave'].includes(status)) {
      return res.status(400).json({ error: 'status must be Present, Absent, or Leave' });
    }
    const stmt = db.prepare(
      'INSERT INTO attendance (student_name, class, date, status) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(student_name, cls || '', date, status);
    const newRecord = db.prepare('SELECT * FROM attendance WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/attendance/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM attendance WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Attendance record removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== FEES ==================

app.get('/api/fees', (req, res) => {
  try {
    const { status, class: cls } = req.query;
    let query = 'SELECT * FROM fees';
    const conditions = [];
    const params = [];
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (cls) { conditions.push('class = ?'); params.push(cls); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY id DESC';
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fees', (req, res) => {
  try {
    const { student_name, class: cls, month, amount, status } = req.body;
    if (!student_name || !month || amount === undefined || !status) {
      return res.status(400).json({ error: 'student_name, month, amount, and status are required' });
    }
    if (!['Paid', 'Unpaid'].includes(status)) {
      return res.status(400).json({ error: 'status must be Paid or Unpaid' });
    }
    const stmt = db.prepare(
      'INSERT INTO fees (student_name, class, month, amount, status) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(student_name, cls || '', month, amount, status);
    const newRecord = db.prepare('SELECT * FROM fees WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/fees/:id', (req, res) => {
  try {
    const { status } = req.body;
    if (!['Paid', 'Unpaid'].includes(status)) {
      return res.status(400).json({ error: 'status must be Paid or Unpaid' });
    }
    const info = db.prepare('UPDATE fees SET status=? WHERE id=?').run(status, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Record not found' });
    const updated = db.prepare('SELECT * FROM fees WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/fees/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM fees WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Fee record removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== HOMEWORK ==================

app.get('/api/homework', (req, res) => {
  try {
    const { class: cls } = req.query;
    let query = 'SELECT * FROM homework';
    const params = [];
    if (cls) { query += ' WHERE class = ?'; params.push(cls); }
    query += ' ORDER BY id DESC';
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/homework', (req, res) => {
  try {
    const { class: cls, subject, description, due_date } = req.body;
    if (!cls || !subject || !description) {
      return res.status(400).json({ error: 'class, subject, and description are required' });
    }
    const stmt = db.prepare(
      'INSERT INTO homework (class, subject, description, due_date) VALUES (?, ?, ?, ?)'
    );
    const info = stmt.run(cls, subject, description, due_date || '');
    const newRecord = db.prepare('SELECT * FROM homework WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/homework/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM homework WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Homework removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== RESULTS ==================

app.get('/api/results', (req, res) => {
  try {
    const { class: cls, student_name } = req.query;
    let query = 'SELECT * FROM results';
    const conditions = [];
    const params = [];
    if (cls) { conditions.push('class = ?'); params.push(cls); }
    if (student_name) { conditions.push('student_name = ?'); params.push(student_name); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY id DESC';
    const rows = db.prepare(query).all(...params);

    // Add computed percentage and grade
    const enriched = rows.map(r => {
      const pct = (r.obtained_marks / r.total_marks) * 100;
      return {
        ...r,
        percentage: Math.round(pct * 100) / 100,
        grade: getGrade(pct)
      };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/results', (req, res) => {
  try {
    const { student_name, class: cls, subject, obtained_marks, total_marks } = req.body;
    if (!student_name || !subject || obtained_marks === undefined || !total_marks) {
      return res.status(400).json({ error: 'student_name, subject, obtained_marks, and total_marks are required' });
    }
    if (total_marks <= 0) {
      return res.status(400).json({ error: 'total_marks must be greater than 0' });
    }
    const stmt = db.prepare(
      'INSERT INTO results (student_name, class, subject, obtained_marks, total_marks) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(student_name, cls || '', subject, obtained_marks, total_marks);
    const newRecord = db.prepare('SELECT * FROM results WHERE id = ?').get(info.lastInsertRowid);
    const pct = (newRecord.obtained_marks / newRecord.total_marks) * 100;
    res.status(201).json({
      ...newRecord,
      percentage: Math.round(pct * 100) / 100,
      grade: getGrade(pct)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/results/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Result removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== DASHBOARD STATS ==================
app.get('/api/stats', (req, res) => {
  try {
    const teachers = db.prepare('SELECT COUNT(*) AS c FROM teachers').get().c;
    const students = db.prepare('SELECT COUNT(DISTINCT student_name) AS c FROM attendance').get().c;
    const unpaidFees = db.prepare("SELECT COUNT(*) AS c FROM fees WHERE status = 'Unpaid'").get().c;
    const homework = db.prepare('SELECT COUNT(*) AS c FROM homework').get().c;
    const results = db.prepare('SELECT COUNT(*) AS c FROM results').get().c;
    res.json({ teachers, students, unpaidFees, homework, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== HELPER ==================
function getGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'F';
}

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`Swiss International Cadet College API running on port ${PORT}`);
});
