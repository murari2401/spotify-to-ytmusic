const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  spotifyToken: {
    access_token: String,
    refresh_token: String,
    expires_at: Number
  },
  youtubeToken: {
    access_token: String,
    refresh_token: String,
    expires_at: Number
  }
});

module.exports = mongoose.model('User', UserSchema);