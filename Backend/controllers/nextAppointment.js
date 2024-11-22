const Patient = require('../Models/PatientModel');
const Session = require('../Models/SessionModel');

const nextAppointment = async (req, res) => {
    try {
        const patientId = req.query.patientId;

        if (!patientId) {
            return res.status(400).json({ error: "Patient ID is required." });
        }

        const patient = await Patient.findById(patientId).exec();

        if (!patient) {
            return res.status(404).json({ error: "Patient not found." });
        }

        const sessionIds = patient.sessionLogs.map(log => log.sessionId);
        const sessions = await Session.find({ _id: { $in: sessionIds } });

        const sortedSessions = sessions
            .filter(session => new Date(session.startTime) > new Date())
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        const nextSession = sortedSessions.length > 0 ? sortedSessions[0] : null;

        res.status(200).json(nextSession);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = nextAppointment;
