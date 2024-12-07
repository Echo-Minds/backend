// routes/supervisorRoutes.js
const express = require('express');
const router = express.Router();
const { registerSupervisor, loginSupervisor, getAllSupervisors, getMonthlyPatientCounts } = require('../controllers/SupervisorController');
const { verifyToken } = require('../utils/auth');

// Register a supervisor
router.post('/register', registerSupervisor);

// Login a supervisor
router.post('/login', loginSupervisor);

// Get all supervisors (Authenticated)
router.get('/supervisors', verifyToken, getAllSupervisors);

router.get('/monthly_patients', getMonthlyPatientCounts)

module.exports = router;
