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
    },
    notes: [{
        monotone: { type: Number, min: 1, max: 5 },
        hyperprosodic: { type: Number, min: 1, max: 5 },
        dysprosodic: { type: Number, min: 1, max: 5 },
        appropriateProsody: { type: Number, min: 1, max: 5 },
        prosodyComment: { type: String }, 

        hoarseVoice: { type: Number, min: 1, max: 5 },
        breathyVoice: { type: Number, min: 1, max: 5 },
        glottalFry: { type: Number, min: 1, max: 5 },
        appropriateVoiceQuality: { type: Number, min: 1, max: 5 },
        hypernasal: { type: Number, min: 1, max: 5 },
        voiceQualityComment: { type: String },  // One comment for the entire Voice Quality section

        highPitch: { type: Number, min: 1, max: 5 },
        lowPitch: { type: Number, min: 1, max: 5 },
        appropriatePitch: { type: Number, min: 1, max: 5 },
        loudVoice: { type: Number, min: 1, max: 5 },
        softVoice: { type: Number, min: 1, max: 5 },
        pitchLoudnessComment: { type: String },
    }],
    nextStartTime:{
        type: Date,
    }, nextEndTime:{
        type: Date,
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
        required: false,
    },
});

const Session = mongoose.model('Session', SessionSchema);
module.exports = Session;
