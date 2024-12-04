// models/therapist.model.js
const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  course: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Storing the image as a base64 string or URL
  },
});

module.exports = mongoose.model('Therapist', therapistSchema);
