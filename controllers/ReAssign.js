const Session = require('../Models/SessionModel');
const Therapist = require('../Models/TherapistModel');
const Patient = require('../Models/PatientModel');

const handleSessionRating = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.rating < 3) {
      const currentTherapist = await Therapist.findById(session.therapistId);
      const patient = await Patient.findById(session.patientId);

      const therapists = await Therapist.find({
        _id: { $ne: currentTherapist._id }
      });

      const therapistWithLeastPatients = therapists.reduce((prev, curr) => {
        return prev.assignedPatients.length < curr.assignedPatients.length ? prev : curr;
      });

      if (!therapistWithLeastPatients) {
        return res.status(404).json({ message: 'No available therapist found' });
      }

      await Therapist.updateOne(
        { _id: currentTherapist._id },
        { $pull: { assignedPatients: patient._id } }
      );

      await Therapist.updateOne(
        { _id: therapistWithLeastPatients._id },
        { $push: { assignedPatients: patient._id } }
      );

      await Patient.updateOne(
        { _id: patient._id },
        { therapistId: therapistWithLeastPatients._id }
      );

      session.therapistId = therapistWithLeastPatients._id;
      await session.save();

      return res.status(200).json({ message: 'Patient reassigned to a new therapist', session });
    }

    return res.status(200).json({ message: 'Session rating is satisfactory', session });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = {
  handleSessionRating,
};
