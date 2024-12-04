const Session = require('../Models/SessionModel');
const Therapist = require('../Models/TherapistModel');
const Notification = require('../Models/NotificationModel');
const Patient = require('../Models/PatientModel'); 

const deleteSession = async (req, res) => {
  const sessionId = req.query.sessionId;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).send({ message: "Session not found" });
    }

    const { patientId,therapistId, startTime } = session;
    const sessionDate = new Date(startTime).toISOString();
    console.log(sessionDate);
    const tempDate = new Date(startTime);
    const sessionDay = tempDate.toLocaleString('en-US', { weekday: 'long' ,timeZone:'UTC'});
    const sessionParts = sessionDate.toString().split('T');
    const sessionStartTime = sessionParts[1].substring(0, 5); 

    const result = await Session.deleteOne({ _id: sessionId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Session not found" });
    }

    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).send({ message: "Therapist not found" });
    }

    const availableTimes = therapist.availableTimes.map((timeSlot) => {
      if (timeSlot.day === sessionDay) {
        timeSlot.slots = timeSlot.slots.map((slot) => {
          if (slot.startTime === sessionStartTime) {
            slot.isAvailable = true;
          }
          return slot;
        });
      }
      return timeSlot;
    });

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).send({ message: "Patient not found" });
    }

    patient.noOfSessions = Math.max(patient.noOfSessions - 1, 0); 
    patient.sessionLogs = patient.sessionLogs.filter((log) => log.sessionId.equals(sessionId));

    await patient.save();

    const deleteOne = await Notification.create({
      type:"Session Cancelled",
      message:`The session with ${therapist.name} was cancelled at ${new Date()}`,
      patientId:session.patientId,
      therapistId:session.therapistId,
      timestamp: new Date(),
      isRead:false,
    }
    )
    therapist.availableTimes = availableTimes;
    await therapist.save();

    return res.status(200).send("Cancelled successfully and therapist availability updated.");
  } catch (err) {
    console.error("Error deleting session:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = deleteSession;
