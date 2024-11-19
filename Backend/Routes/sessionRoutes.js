const express = require('express');
const { scheduleSession } = require('../controllers/SessionSchedular');

const router = express.Router();

router.post('/schedule', scheduleSession);

module.exports = router;
