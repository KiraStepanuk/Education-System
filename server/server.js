const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Тестовий маршрут
app.get('/', (req, res) => {
    res.send('Сервер успішно запущений і працює!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});