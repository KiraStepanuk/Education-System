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

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (row) {
        res.json({ success: true, user: row });
      } else {
        res.status(401).json({ success: false, message: "Неверный логин или пароль" });
      }
    }
  );
});

function checkRole(role) {
  return (req, res, next) => {
    const userId = req.headers['user_id'];

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
      if (!user) return res.status(401).json({ error: "No user" });

      if (user.role !== role) {
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = user;
      next();
    });
  };
}

app.get('/courses', (req, res) => {
  const { author_id, status } = req.query;

  let query = "SELECT * FROM courses WHERE 1=1";
  const params = [];

  if (author_id) {
    query += " AND author_id = ?";
    params.push(author_id);
  }

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  db.all(query, params, (err, rows) => {
    res.json(rows);
  });
});

app.post('/courses', (req, res) => {
  const { title, content, author_id } = req.body;

  db.run(
    `INSERT INTO courses (title, content, author_id, status)
     VALUES (?, ?, ?, 'pending')`,
    [title, content, author_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ success: true, course_id: this.lastID });
    }
  );
});

app.get('/courses/:id', (req, res) => {
  db.get(
    "SELECT * FROM courses WHERE id = ?",
    [req.params.id],
    (err, row) => {
      res.json(row);
    }
  );
});

app.put('/courses/:id', (req, res) => {
  const { title, content } = req.body;

  db.run(
    `UPDATE courses 
     SET title = ?, content = ?, status = 'pending', reject_reason = ''
     WHERE id = ?`,
    [title, content, req.params.id],
    function () {
      res.json({ success: true });
    }
  );
});

app.put('/courses/:id/approve', checkRole('admin'), (req, res) => {
  db.run(
    `UPDATE courses SET status = 'approved' WHERE id = ?`,
    [req.params.id],
    function () {
      res.json({ success: true });
    }
  );
});

app.put('/courses/:id/reject', checkRole('admin'), (req, res) => {
  const { reject_reason } = req.body;

  db.run(
    `UPDATE courses 
     SET status = 'rejected', reject_reason = ?
     WHERE id = ?`,
    [reject_reason, req.params.id],
    function () {
      res.json({ success: true });
    }
  );
});

app.listen(5000, () => console.log('Server running on port 5000'));