// models/SupervisorModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const supervisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String }, // Base64 or image URL
}, { timestamps: true });

// Pre-save hook to hash the password before storing
// supervisorSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//   }
//   next();
// });

// Method to compare password during login
supervisorSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

module.exports = Supervisor;
