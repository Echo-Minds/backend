const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const TherapistSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  supervisorIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Supervisor',
    default: [] 
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
  assignedPatients: [{ type: Types.ObjectId, ref: 'Patient' }],
  availableTimes: [
    {
      day: { type: String, required: true },
      slots: [
        {
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
          isAvailable: { type: Boolean, required: true }
        }
      ]
    }
  ],
  commentsFromSupervisor: [
    {
      supervisorIds: [{ type: Types.ObjectId, ref: 'Supervisor' }],
      comment: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  grades: [
    {
      date: { type: Date, required: true }, // Date of the grade record
      grade: { type: Number, required: true }
    }
  ],
  sessions: [
    {
      date: { type: Date, required: true }, // Date of the session data
      data: {
        sessionsBooked: { type: Number, default: 0 },
        sessionsCancelled: { type: Number, default: 0 },
        sessionsConducted: { type: Number, default: 0 },
        sessionsConductedOnline: { type: Number, default: 0 },
        sessionsConductedOffline: { type: Number, default: 0 }
      }
    }
  ]
});

const Therapist = mongoose.model('therapists', TherapistSchema);
module.exports = Therapist;
