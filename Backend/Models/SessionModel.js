const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const SessionSchema = new Schema({
    patientId: {
        type: Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    therapistId: {
        type: Types.ObjectId,
        ref: 'Therapist',
        required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    mood: { type: String, enum: ['Happy', 'Neutral', 'Sad', 'Angry', 'Calm'], required: true },
    notes: { type: String },
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
