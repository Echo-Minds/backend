// therapistRoutes.js

const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/TherapistController');
const { verifyToken } = require('../utils/auth'); // Middleware for token verification

// Register a new therapist
router.post('/register', therapistController.registerTherapist);

// Login a therapist
router.post('/login', therapistController.loginTherapist);

// Get all therapists (protected route)
router.get('/', verifyToken, therapistController.getAllTherapists);

module.exports = router;
