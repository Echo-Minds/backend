const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const SupervisorSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: { 
        type: String, 
        required: true 
    },
    specialization: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String 
    }, 
    therapistIds: [
        {
            type: Types.ObjectId,
            ref: 'therapists', 
        },
    ],
    reports: [
        {
            therapistId: {
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
            combinedReport: {
                type: String,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    monthlyPatientCounts: [
        {
            month: { 
                type: String, 
                required: true 
            },
            patientCount: { 
                type: Number, 
                required: true 
            }
        }
    ]
});


const Supervisor = mongoose.model('supervisors', SupervisorSchema);
module.exports = Supervisor;
