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
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    mood: { 
        type: String, 
        enum: ['Happy', 'Neutral', 'Sad', 'Angry', 'Calm', 'Good'], 
        required: true 
    },
    notes: { 
        type: String 
    },
    sessionType: { 
        type: String, 
        enum: ['Online', 'Offline'],
    },
    meetLink: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-]*)*\/?(\?[\w\-]+=[\w\-]+(&[\w\-]+=[\w\-]+)*)?$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
        required: function () { return this.sessionType === 'Online'; }
    },
    rating: {
        type: Number,
        min: 1.0,
        max: 5.0,
        validate: {
            validator: function (v) {
                return Number(v) >= 1.0 && Number(v) <= 5.0;
            },
            message: props => `Rating must be a decimal value between 1.0 and 5.0, received ${props.value}`,
        },
    },
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
