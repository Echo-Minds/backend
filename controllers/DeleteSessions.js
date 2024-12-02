const Session = require('../Models/SessionModel');
const Therapist = require('../Models/TherapistModel');
const Notification = require('../Models/NotificationModel');
const deleteSession = async (req, res) => {
  const sessionId = req.query.sessionId;

  try {
    // Find the session to retrieve session details
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).send({ message: "Session not found" });
    }

    // Extract details from the session
    const { therapistId, startTime } = session;
    const sessionDate = new Date(startTime).toISOString();
    console.log(sessionDate);
    const tempDate = new Date(startTime);
    const sessionDay = tempDate.toLocaleString('en-US', { weekday: 'long' ,timeZone:'UTC'});
    const sessionParts = sessionDate.toString().split('T'); // Split into date and time parts
    console.log(sessionParts[1]);
    const sessionStartTime = sessionParts[1].substring(0, 5); // Take time part and format as "HH:mm"
    console.log(sessionDay);
    console.log(sessionStartTime);
    // Delete the session
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
