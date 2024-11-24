const express = require('express');
const router = express.Router();
const Notification = require('../Models/NotificationModel');
const Session = require('../Models/SessionModel'); 

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const { patientId, startTime, endTime, sessionType, meetLink } = req.body;
    
    const session = await Session.create({
      patientId,
      startTime,
      endTime,
      sessionType,
      meetLink: sessionType === 'Online' ? meetLink : null, 
    });

    await Notification.create({
      patientId,
      type: 'session',
      title: 'Session Scheduled',
      message: `Your session is booked for ${new Date(startTime).toLocaleString()} (${sessionType}).`,
      date: new Date(),
    });

    res.status(201).json({ message: 'Session booked successfully', session });
  } catch (err) {
    console.error(err); 
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
