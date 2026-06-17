const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Course = require('./models/Course');
const Review = require('./models/Review');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Успішно підключено до MongoDB Atlas'))
  .catch(err => console.error('Помилка підключення до MongoDB:', err));


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

app.post('/auth/google', async (req, res) => {
  const { profile } = req.body;

  if (!profile || !profile.email) {
    return res.status(400).json({ success: false, message: "Недійсні дані профілю Google" });
  }

  try {
    const userEmail = profile.email;
    let user = await User.findOne({ username: userEmail });

    if (!user) {
      const dummyPassword = Math.random().toString(36).slice(-10) + 'Gg1!';
      
      const newUser = new User({
        username: userEmail,
        password: dummyPassword,
        firstName: profile.given_name || 'User',
        lastName: profile.family_name || 'Google',
        role: 'user'
      });

      user = await newUser.save();
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error("Помилка під час авторизації через Google:", error);
    res.status(500).json({ success: false, message: "Помилка сервера при авторизації" });
  }
});


app.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, role } = req.body;

  try {

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Користувач з таким логіном вже існує" });
    }

    const newUser = new User({
      username,
      password,
      firstName,
      lastName,
      role: role || 'user'
    });

    const savedUser = await newUser.save();

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
  const { title, content, image, category } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { title, content, image, category, status: 'pending', reject_reason: '' },
        { returnDocument: 'after' }
    );

    if (!updatedCourse) return res.status(404).json({ error: "Курс не знайдено" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/users/:id/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    // Перевіряємо, чи правильний поточний пароль
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Невірний поточний пароль" });
    }

    // Зберігаємо новий пароль
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Пароль успішно змінено" });
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

app.put('/users/:id', async (req, res) => {
  const { firstName, lastName, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, avatar },
        { returnDocument: 'after', select: '-password' }
    );

    if (!updatedUser) return res.status(404).json({ error: "Користувача не знайдено" });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/courses/:id/approve', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { status: 'approved' },
        { returnDocument: 'after', select: '-password' });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));