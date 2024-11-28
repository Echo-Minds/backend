const Patient = require('../Models/PatientModel');
const Session = require('../Models/SessionModel');
const { DateTime } = require('luxon');

const nextAppointment = async (req, res) => {
    try {
        const patientId = req.query.patientId;

        if (!patientId) {
            return res.status(404).json({ error: "Patient ID is required." });
        }

        const patient = await Patient.findById(patientId).exec();

        if (!patient) {
            return res.status(404).json({ error: "Patient not found." });
        }

        const sessionIds = patient.sessionLogs.map(log => log.sessionId);
        const sessions = await Session.find({ _id: { $in: sessionIds } }).exec();
        if (!sessions || sessions.length === 0) {
            return res.status(200).json({ message: 'No sessions found for this patient.' });
        }

        const currentT = DateTime.now().setZone("Asia/Kolkata").toISO();
        const currentTime = new Date(currentT.replace('+05:30','Z'));
        const sortedSessions = sessions
            .filter(session => {
                const sessionStartTime = new Date(session.startTime);
                return sessionStartTime > currentTime;  
            })
            .sort((a, b) => {
                const startTimeA = DateTime.fromISO(a.startTime).setZone("Asia/Kolkata");
                const startTimeB = DateTime.fromISO(b.startTime).setZone("Asia/Kolkata");
                return startTimeA - startTimeB; 
            });

        const nextSession = sortedSessions.length > 0 ? sortedSessions[0] : null;

        if (!nextSession) {
            return res.status(200).json({ message: 'No upcoming sessions found.' });
        }

        res.status(200).json(nextSession);
    } catch (error) {
        console.error("Error fetching next appointment:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = nextAppointment;
