const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: String,
  options: [String],
  correctLetter: String
});

const QuizSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: String,
  description: String,
  timeLimit: Number,
  passingScore: Number,
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Quiz', QuizSchema);