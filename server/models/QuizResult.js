const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  score: Number,
  totalQuestions: Number,
  percent: Number,
  isPassed: Boolean,
  timeSpent: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);