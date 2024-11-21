const express = require('express');
const {handleSessionRating} = require('../controllers/ReAssign')
const { scheduleSession } = require('../controllers/SessionSchedular'); 
const {assignPatientToTherapist} = require('../controllers/Assignment');
const router = express.Router();

router.post('/schedule', scheduleSession);
router.post('/assign', assignPatientToTherapist);
router.post('/reassign', handleSessionRating);


module.exports = router;
