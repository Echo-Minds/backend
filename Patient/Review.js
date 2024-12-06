const Session = require('../Models/SessionModel');
const Patient = require('../Models/PatientModel');

const getReviews = async (req, res) => {
    const { id: patientId } = req.params;
    console.log("Patient ID:", patientId);

    try {
        // Find the patient and populate their session logs
        const patient = await Patient.findById(patientId).populate('sessionLogs.sessionId');
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Extract sessions from sessionLogs
        const sessionLogs = patient.sessionLogs || [];

        // Fetch reviews for each session and track session order
        const reviewsWithSessions = [];
        for (let i = 0; i < sessionLogs.length; i++) {
            const session = sessionLogs[i].sessionId;
            if (!session) continue; 
            
            const reviews = (session.notes || [])
                .map(note => note.reviewToPatient)
                .filter(review => review); 
            
            if (reviews.length > 0) {
                reviewsWithSessions.push({
                    sessionNumber: `${i + 1}${getOrdinalSuffix(i + 1)} session`,
                    sessionStartTime: session.startTime,
                    sessionEndTime: session.endTime,
                    reviews,
                });
            }
        }

        if (reviewsWithSessions.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this patient.' });
        }

        res.status(200).json(reviewsWithSessions);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const getOrdinalSuffix = (number) => {
    const j = number % 10,
          k = number % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
};

module.exports = {
    getReviews,
};
