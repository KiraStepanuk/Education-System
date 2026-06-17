const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },

  avatar: { type: String, default: '' },

  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],

  bio: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Віртуальне поле 'id', щоб не ламати фронтенд, який очікує 'id' замість '_id'
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);