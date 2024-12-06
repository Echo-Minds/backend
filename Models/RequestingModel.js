const mongoose = require('mongoose');

const AssignmentRequestSchema = new mongoose.Schema({
    therapistId: {
        type: String,
        ref: 'Therapist', 
        required: true,
    },
    supervisorId: {
        type: String,
        ref: 'Supervisor', // Reference to the Supervisor model
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'], // Possible states
        default: 'pending', // Default state
    },
    message: {
        type: String,
        required: true, // Therapist must include a message
        trim: true, // Trims unnecessary spaces
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    updatedAt: {
        type: Date,
    },
});

AssignmentRequestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('AssignmentRequest', AssignmentRequestSchema);
