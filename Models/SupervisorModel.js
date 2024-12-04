const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const SupervisorSchema = new Schema({
    supervisorId: {
        type: Types.ObjectId,
        default: () => new Types.ObjectId(),
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },name:{
        type: String,
        required: true
    },
    therapistIds: [
        {
            type: Types.ObjectId,
            ref: 'therapists', 
        },
    ],
    reports: [
        {
            therapistId:{
                type: Types.ObjectId,
                ref: 'therapists',
                required: true,
            },
            patientId: {
                type: Types.ObjectId, 
            },
            sessionCount: {
                type: Number, 
            },
            feedbackSummary: {
                type: String,
            },
            supervisorComments: {
                type: String, 
            },
            combinedReport:{
                type: String,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

const Supervisor = mongoose.model('supervisors', SupervisorSchema);
module.exports = Supervisor;
