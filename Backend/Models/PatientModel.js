const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const PatientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    noOfSessions: {
        type: Number,
        default: 0,
    },
    therapistId: {
        type: Types.ObjectId,
        ref: 'Therapist',
        required: true,
    },
    sessionLogs: [
        {
            sessionId: {
                type: Types.ObjectId,
                ref: 'Session',
            },
        },
    ],
    goal: {
        type: String,
        required: true,
    },
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
