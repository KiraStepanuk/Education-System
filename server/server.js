require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// ДОДАНО: Імпортуємо бібліотеку Google
const { OAuth2Client } = require('google-auth-library');

const User = require('./models/User');
const Course = require('./models/Course');
const Review = require('./models/Review');

const app = express();
app.use(cors());

// Збільшуємо ліміт для JSON, оскільки картинки в Base64 займають багато місця
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Успішно підключено до MongoDB Atlas'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

// ДОДАНО: Ініціалізуємо Google клієнт
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware для перевірки ролей адміністратора
async function checkRole(role) {
  return async (req, res, next) => {
    const userId = req.headers['user_id'];
    if (!userId) return res.status(401).json({ error: "No user" });

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(401).json({ error: "No user" });
      if (user.role !== role) return res.status(403).json({ error: "Forbidden" });

      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

// --- АВТОРИЗАЦІЯ ---

// ДОДАНО: Маршрут для логіну/реєстрації через Google
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Розшифровуємо токен за допомогою Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Використовуємо email від Google як username
    const userEmail = payload.email;

    // 2. Шукаємо користувача в базі за цим email
    let user = await User.findOne({ username: userEmail });

    // 3. Якщо користувача немає, створюємо нового
    if (!user) {
      // Генеруємо випадковий пароль (наприклад: 'k3a9x7vGg1!')
      const dummyPassword = Math.random().toString(36).slice(-10) + 'Gg1!';

      const newUser = new User({
        username: userEmail,
        password: dummyPassword,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        role: 'user'
      });

      user = await newUser.save();
    }

    // 4. Повертаємо об'єкт користувача на фронтенд
    res.json({ success: true, user });

  } catch (error) {
    console.error("Помилка авторизації Google:", error);
    res.status(401).json({ success: false, message: "Недійсний токен Google" });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, role } = req.body;

  try {
    // 1. Перевіряємо, чи немає вже такого користувача
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Користувач з таким логіном вже існує" });
    }

    // 2. Створюємо та зберігаємо нового користувача в БД
    const newUser = new User({
      username,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    const savedUser = await newUser.save();

    // 3. Повертаємо об'єкт створеного користувача (без пароля)
    res.json({
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Невірний логін або пароль" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- РОУТИ ДЛЯ КОРИСТУВАЧІВ ---

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username role firstName lastName');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username role firstName lastName');
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- РОУТИ ДЛЯ КУРСІВ ---

app.get('/courses', async (req, res) => {
  const { author_id, status } = req.query;
  const filter = {};

  if (author_id) filter.author_id = author_id;
  if (status) filter.status = status;

  try {
    const courses = await Course.find(filter)
      .populate('author_id', 'firstName lastName avatar');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/courses', async (req, res) => {
  const {
    title,
    content,
    image,
    author_id,
    category,
    tags
  } = req.body;

  try {
    const newCourse = new Course({
      title,
      content,
      image,
      author_id,
      category,
      tags,
      status: 'pending'
    });

    const savedCourse = await newCourse.save();
    res.json({ success: true, course_id: savedCourse._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('author_id', 'firstName lastName avatar');

    if (!course) return res.status(404).json({ error: "Курс не знайдено" });

    course.views += 1;
    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/courses/:id', async (req, res) => {
  const { title, content, image } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { title, content, image, status: 'pending', reject_reason: '' },
        { new: true }
    );

    if (!updatedCourse) return res.status(404).json({ error: "Курс не знайдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/courses/:id', async (req, res) => {
  const userId = req.headers['user_id'];

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Курс не знайдено" });

    if (course.author_id.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- РОУТИ МОДЕРАЦІЇ ---

app.put('/courses/:id/approve', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { status: 'approved' });
    if (!course) return res.status(404).json({ error: "Курс не знайдено" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/courses/:id/reject', async (req, res) => {
  const { reject_reason } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected', reject_reason }
    );

    if (!course) return res.status(404).json({ error: "Курс не знайдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));