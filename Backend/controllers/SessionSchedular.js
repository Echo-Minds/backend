const Session = require('../Models/SessionModel');
const Therapist = require('../Models/TherapistModel');
const Patient = require('../Models/PatientModel');

const scheduleSession = async (req, res) => {
  
  console.log('Therapist model:', Therapist);
  const { patientId, therapistId, startTime, endTime, mood, notes } = req.body;
  try {
    console.log('Finding therapist with ID:', therapistId);
    const therapists = await Therapist.find();
    console.log('Therapist found:', therapists);

    if (!therapists) {
      console.log('Therapist not found with ID:', therapistId);
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const requestedDay = new Date(startTime).toLocaleString('en-us', { weekday: 'long' });
    const isAvailable = therapists.availableTimes.some((timeSlot) => {
      const slotStart = new Date(`1970-01-01T${timeSlot.startTime}Z`);
      const slotEnd = new Date(`1970-01-01T${timeSlot.endTime}Z`);
      const sessionStart = new Date(startTime);
      const sessionEnd = new Date(endTime);
      return (
        timeSlot.day === requestedDay &&
        sessionStart >= slotStart &&
        sessionEnd <= slotEnd
      );
    });

    if (!isAvailable) {
      return res.status(400).json({ message: 'Therapist is not available at the selected time' });
    }

    const overlappingSessions = await Session.find({
      therapistId,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
      ],
    });

    if (overlappingSessions.length > 0) {
      return res.status(400).json({ message: 'Therapist is already booked for the selected time' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newSession = new Session({
      patientId,
      therapistId,
      startTime,
      endTime,
      mood,
      notes,
    });

    await newSession.save();

    await Patient.updateOne(
      { _id: patientId },
      { $inc: { noOfSessions: 1 } }
    );

    return res.status(201).json({ message: 'Session scheduled successfully', session: newSession });
  } catch (err) {
    console.error('Error scheduling session:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = {
  scheduleSession,
};
