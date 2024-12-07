// therapistRoutes.js

const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/TherapistController');
const { verifyToken } = require('../utils/auth');// Middleware for token verification
const { getRecentSessions, registerTherapist, loginTherapist, getAllTherapists, getAverageGrades } = require('../controllers/TherapistController');



// Register a new therapist
router.post('/register', registerTherapist);

// Login a therapist
router.post('/login', loginTherapist);

// Get all therapists (protected route)
router.get('/', verifyToken, getAllTherapists);

router.get('/average-grades', getAverageGrades);
router.get('/sessions/last7days', getRecentSessions);

module.exports = router;
