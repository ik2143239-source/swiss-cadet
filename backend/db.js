const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'swiss_cadet.db'));

db.pragma('journal_mode = WAL');

// ---------- Create Tables ----------
db.exec(`
CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  class TEXT,
  contact TEXT,
  qualification TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name TEXT NOT NULL,
  class TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present','Absent','Leave')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name TEXT NOT NULL,
  class TEXT,
  month TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Paid','Unpaid')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_name TEXT NOT NULL,
  class TEXT,
  subject TEXT NOT NULL,
  obtained_marks REAL NOT NULL,
  total_marks REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

module.exports = db;
