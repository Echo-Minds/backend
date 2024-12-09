const Session = require('../Models/SessionModel');
const Patient = require('../Models/PatientModel');
const {DateTime} = require('luxon');

const getPatientList = async (req, res) => {
  const { therapistId } = req.query;
  try {
    const currentDate = DateTime.now().setZone("Asia/Kolkata").toISO(); 
    const currentDatePlus45 = DateTime.fromISO(currentDate).minus({ minutes: 45 }).toISO();
    const currentDateOff = currentDatePlus45.replace('+05:30','Z');
    const sessions = await Session.find({
      therapistId,
      startTime: { $gte: currentDateOff }, 
    })
      .sort({ startTime: 1 })
      .exec();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: 'No upcoming sessions found for this therapist' });
    }

    const patientData = await Promise.all(
      sessions.map(async (session) => {
        const patient = await 
        
        
        
        
        
        
        Patient.findById(session.patientId).exec();
        return {
          name: patient.name,
          age: patient.age,
          nextAppointment: session.startTime,
          sessionId : session._id,
          patientId: session.patientId,
          meetLink: session.meetLink
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
