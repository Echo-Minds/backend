const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  age: Number,
  gender: String,
  goals: String,
  password: String,
});

const Patient = mongoose.model('patient', patientSchema);

module.exports = Patient;
