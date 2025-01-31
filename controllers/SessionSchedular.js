const Session = require('../Models/SessionModel');
const Therapist = require('../Models/TherapistModel');
const Patient = require('../Models/PatientModel');
const Notification = require('../Models/NotificationModel');
const { sendReportToSupervisor } = require('./ReportSumbission');

const scheduleSession = async (req, res) => {
  const { 
    patientId, 
    startTime, 
    endTime, 
    mood, 
    notes, 
    sessionType, 
    rating 
  } = req.body;
  try {
    const patient = await Patient.findById(patientId);
    console.log(startTime);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const therapist = await Therapist.findById(patient.therapistId);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const requestedDay = new Date(startTime).toLocaleString('en-us', {weekday: 'long', timeZone:'UTC'});
    let isAvailable = false;
    let selectedSlot = null;
    console.log(requestedDay);
    therapist.availableTimes.forEach((timeSlot) => {
      if (timeSlot.day === requestedDay) {
        timeSlot.slots.forEach((slot) => {
          const slotStartTime = slot.startTime.split(':');
          const slotEndTime = slot.endTime.split(':');
          const slotStart = new Date(Date.UTC(1970, 0, 1, slotStartTime[0], slotStartTime[1]));
          const slotEnd = new Date(Date.UTC(1970, 0, 1, slotEndTime[0], slotEndTime[1]));
          const sessionStartTime = new Date(startTime);
          const sessionEndTime = new Date(endTime);
          const sessionStart = new Date(Date.UTC(1970, 0, 1, sessionStartTime.getUTCHours(), sessionStartTime.getUTCMinutes()));
          const sessionEnd = new Date(Date.UTC(1970, 0, 1, sessionEndTime.getUTCHours(), sessionEndTime.getUTCMinutes()));
          if (sessionStart >= slotStart && sessionEnd <= slotEnd && slot.isAvailable) {
            isAvailable = true;
            selectedSlot = slot;
          }
        });
      }
    });

    if (!isAvailable) {
      return res.status(400).json({ message: 'Therapist is not available at the requested time.' });
    }

    const overlappingSessions = await Session.find({
      therapistId: therapist._id,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
      ],
    });

    if (overlappingSessions.length > 0) {
      return res.status(400).json({ message: 'Therapist is already booked for the selected time.' });
    }

    const onlineMeetingLink = sessionType === 'Online' 
      ? `https://one-to-one-inky.vercel.app/room/${patientId}` 
      : undefined;

    const newSession = await Session.create({
      patientId,
      therapistId: therapist._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      mood,
      notes,
      sessionType,
      meetLink: onlineMeetingLink,
      rating,
      status: 'online',
      sessionSlot: selectedSlot,
    });

    await Patient.updateOne(
      { _id: patientId },
      {
        $inc: { noOfSessions: 1 },
        $push: { sessionLogs: { sessionId: newSession._id } },
      }
    );

    await Therapist.updateOne(
      {
        _id: therapist._id,
        'availableTimes.day': requestedDay,
      },
      {
        $set: {
          'availableTimes.$[dayFilter].slots.$[slotFilter].isAvailable': false,
        },
      },
      {
        arrayFilters: [
          { 'dayFilter.day': requestedDay },
          { 'slotFilter.startTime': selectedSlot.startTime },
        ],
      }
    );
    const delay = new Date(endTime).getTime() - Date.now() + 15 * 60 * 1000; 
    console.log(delay);
    setTimeout(() => {
      sendReportToSupervisor(patientId);
    }, delay);
    const newNotify = await Notification.create({
      type:"Session Scheduled",
      message:`Your next session with ${therapist.name} is scheduled at ${startTime.substring(0,startTime.length-1).split('T')}`,
      patientId:patientId,
      therapistId:therapist._id,
      timestamp: new Date(),
      isRead: false
    })
    return res.status(201).json({ message: 'Session successfully scheduled', session: newSession });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = {
  scheduleSession,
};
