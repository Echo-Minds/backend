const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String, 
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true,  
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Therapist', 
    required: false,  
  },
  timestamp: {
    type: Date,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
