const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS courses (
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
    )
`);


// Тестовий маршрут
app.get('/', (req, res) => {
    res.send('Сервер успішно запущений і працює!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});