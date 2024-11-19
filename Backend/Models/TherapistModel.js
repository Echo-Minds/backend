const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const TherapistSchema = new Schema({
    email: {
        type: String,
        required: true,
    },name:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    supervisorIds: {
        type: Types.ObjectId,
        ref: 'Supervisor', 
    },
    assignedPatients: [
        {
            type: Types.ObjectId,
            ref: 'Patient', 
        },
    ],
    availableTimes: [
        {
          day: { type: String, required: true },  
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },  
        },
      ],
    commentsFromSupervisor: [
        {
            supervisorIds: [{
                type: Types.ObjectId,
                ref: 'Supervisor', 
            }],
            
            comment: {
                type: String,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Therapist = mongoose.model('therapists', TherapistSchema);
module.exports = Therapist;
