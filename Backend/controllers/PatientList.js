const Session = require('../Models/SessionModel');
const Patient = require('../Models/PatientModel');

const getPatientList = async (req, res) => {
  const { therapistId } = req.query;
  try {
    const currentDate = new Date(); 

    const sessions = await Session.find({
      therapistId,
      startTime: { $gte: currentDate }, 
    })
      .sort({ startTime: 1 })
      .exec();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: 'No upcoming sessions found for this therapist' });
    }

    const patientData = await Promise.all(
      sessions.map(async (session) => {
        const patient = await Patient.findById(session.patientId).exec();
        return {
          name: patient.name,
          age: patient.age,
          nextAppointment: session.startTime,
        };
      })
    );

    res.json(patientData);
  } catch (error) {
    console.error('Error fetching sessions or patient data: ', error);
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

module.exports = getPatientList;
