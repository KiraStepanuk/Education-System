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

// ==========================================
// Auth & Users
// ==========================================

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

<<<<<<< Tovaliuk
app.put('/users/:id/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Невірний поточний пароль" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Пароль успішно змінено" });
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

// ==========================================
// Courses
// ==========================================

=======
>>>>>>> main
app.get('/courses', async (req, res) => {
  const { status, sort } = req.query;

  let filter = {};
  if (status) filter.status = status;

  let sortOption = {};

  switch (sort) {
    case 'new':
      sortOption = { createdAt: -1 };
      break;

    case 'old':
      sortOption = { createdAt: 1 };
      break;

    case 'views':
      sortOption = { views: -1 };
      break;

    case 'rating':
      sortOption = { averageRating: -1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  try {

    const courses = await Course.find(filter)
<<<<<<< Tovaliuk
        .populate('author_id', 'firstName lastName avatar');
    res.json(courses);
=======
      .populate('author_id', 'firstName lastName avatar')
      .sort(sortOption);


    const coursesWithAuthors = courses.map(c => {
      const courseObj = c.toJSON();
      
      if (c.author_id) {
        courseObj.authorName = `${c.author_id.firstName} ${c.author_id.lastName}`;
        courseObj.authorAvatar = c.author_id.avatar || '';
        

        courseObj.author_id = c.author_id._id.toString();
      } else {
        courseObj.authorName = 'Невідомий автор';
        courseObj.authorAvatar = '';
      }
      
      return courseObj;
    });

    res.json(coursesWithAuthors);
>>>>>>> main
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

<<<<<<< Tovaliuk
=======
app.put('/users/:id/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Невірний поточний пароль" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Пароль успішно змінено" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

>>>>>>> main
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

// ==========================================
// Comments & Ratings (Reviews)
// ==========================================

app.get('/courses/:id/comments', async (req, res) => {
  try {
    // ВАЖЛИВО: Додано фільтр, щоб відсікати порожні коментарі
    const comments = await Review.find({
      course_id: req.params.id,
      comment: { $exists: true, $ne: "" }
    })
        .populate('user_id', 'firstName lastName avatar')
        .sort({ createdAt: -1 });

    const formattedComments = comments.map(review => ({
      _id: review._id,
      text: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      author: {
        name: review.user_id ? `${review.user_id.firstName} ${review.user_id.lastName}` : 'Невідомий користувач',
        avatar: review.user_id?.avatar
      }
    }));

    res.json(formattedComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/courses/:id/comments', async (req, res) => {
  const { text, rating } = req.body;
  const userId = req.headers['user_id'];

  if (!userId) {
    return res.status(401).json({ error: "Користувач не авторизований" });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Текст коментаря не може бути порожнім" });
  }

  try {
    const newReview = new Review({
      course_id: req.params.id,
      user_id: userId,
      comment: text,
      rating: rating || 5
    });

    const savedReview = await newReview.save();

    await savedReview.populate('user_id', 'firstName lastName avatar');

    const formattedComment = {
      _id: savedReview._id,
      text: savedReview.comment,
      rating: savedReview.rating,
      createdAt: savedReview.createdAt,
      author: {
        name: savedReview.user_id ? `${savedReview.user_id.firstName} ${savedReview.user_id.lastName}` : 'Невідомий користувач',
        avatar: savedReview.user_id?.avatar
      }
    };

    res.status(201).json(formattedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// НОВИЙ ЕНДПОІНТ ДЛЯ РЕЙТИНГУ
app.post('/courses/:id/rate', async (req, res) => {
  const { rating } = req.body;
  const userId = req.headers['user_id'];
  const courseId = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: "Користувач не авторизований" });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Некоректна оцінка. Оберіть від 1 до 5." });
  }

  try {
    // Шукаємо, чи залишав користувач вже відгук/оцінку
    let review = await Review.findOne({ course_id: courseId, user_id: userId });

    if (review) {
      // Якщо відгук є, просто оновлюємо оцінку
      review.rating = rating;
      await review.save();
    } else {
      // Якщо немає, створюємо новий запис з порожнім коментарем
      review = new Review({
        course_id: courseId,
        user_id: userId,
        rating: rating,
        comment: ""
      });
      await review.save();
    }

    // Перераховуємо середній рейтинг курсу
    const allReviews = await Review.find({ course_id: courseId });
    // Відкидаємо відгуки без оцінок (якщо такі можливі у вашій базі)
    const ratedReviews = allReviews.filter(r => r.rating && r.rating > 0);

    const totalRating = ratedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newReviewsCount = ratedReviews.length;

    // Округлюємо до одного десяткового знаку
    const newAverageRating = newReviewsCount > 0 ? (totalRating / newReviewsCount).toFixed(1) : 0;

    // Оновлюємо дані в моделі Course (переконайтеся, що у CourseSchema є поля rating і reviews)
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          rating: newAverageRating,
          reviews: newReviewsCount
        },
        { returnDocument: 'after' }
    );

    // Повертаємо оновлені дані на фронтенд
    res.json({
      success: true,
      newAverageRating: updatedCourse.rating,
      newReviewsCount: updatedCourse.reviews
    });

  } catch (err) {
    console.error('Помилка при збереженні рейтингу:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));