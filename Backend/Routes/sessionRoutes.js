const express = require('express');
const {handleSessionRating} = require('../controllers/ReAssign')
const { scheduleSession } = require('../controllers/SessionSchedular'); 
const {assignPatientToTherapist} = require('../controllers/Assignment');
const { getSlotsForPatient } = require('../controllers/AvailableSlots');
const nextAppointment = require('../controllers/nextAppointment');
const router = express.Router();

router.post('/schedule', scheduleSession);
router.post('/assign', assignPatientToTherapist);
router.post('/reassign', handleSessionRating);
router.get('/patient/:patientId/availableSlots', getSlotsForPatient);
router.get('/nextAppointment',nextAppointment);

module.exports = router;
