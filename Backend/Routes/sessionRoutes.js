const express = require('express');
const {handleSessionRating} = require('../controllers/ReAssign')
const { scheduleSession } = require('../controllers/SessionSchedular'); 
const {assignPatientToTherapist} = require('../controllers/Assignment');
const { getSlotsForPatient } = require('../controllers/AvailableSlots');
const nextAppointment = require('../controllers/nextAppointment');
const getAssignedPatients = require('../controllers/getAssignedPatients');
const getPatientList = require('../controllers/PatientList');
const deleteSession = require('../controllers/DeleteSessions');
const router = express.Router();

router.post('/schedule', scheduleSession);
router.post('/assign', assignPatientToTherapist);
router.post('/reassign', handleSessionRating);
router.delete('/delete', deleteSession)
router.get('/patient/:patientId/availableSlots', getSlotsForPatient);
router.get('/nextAppointment',nextAppointment);
router.get('/assignedPatients',getAssignedPatients);
router.get('/patientDetails', getPatientList);

module.exports = router;
