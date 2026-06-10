const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    firstName TEXT,
    lastName TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    author_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    reject_reason TEXT DEFAULT '',
    rating REAL DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id)
  )`);

  const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, role, firstName, lastName) VALUES (?, ?, ?, ?, ?)");
stmt.run("admin", "admin123", "admin", "Олександр", "Коваленко");
stmt.run("user", "user123", "user", "Марія", "Шевченко");
  stmt.finalize();
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (row) {
      res.json({ success: true, user: row });
    } else {
      res.status(401).json({ success: false, message: "Неверный логин или пароль" });
    }
  });
});

app.get('/courses', (req, res) => {
  const mockCourses = [
    { id: 1, title: 'Основи Python', reviews: 75, role: 'user' },
    { id: 2, title: 'Excel для бізнесу', reviews: 140, role: 'admin' }
  ];
  res.json(mockCourses);
});

app.listen(5000, () => console.log('Server running on port 5000'));