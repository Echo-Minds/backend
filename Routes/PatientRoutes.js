const express = require('express');
const { registerPatient, loginPatient, getPatientInfo } = require('../controllers/PatientController');
const { verifyToken } = require('../utils/auth');

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.get('/patient/:patient_id', verifyToken, getPatientInfo);

module.exports = router;
