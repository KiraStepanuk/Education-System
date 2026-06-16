const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: '' },

  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  status: { type: String, default: 'pending' },
  reject_reason: { type: String, default: '' },

  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },


  views: {
    type: Number,
    default: 0
  },

  category: {
    type: String,
    default: ''
  },

  averageRating: {
    type: Number,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  tags: {
    type: String,
    default: ''
  }
});

// Віртуальне поле 'id' для сумісності з фронтендом
courseSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);