const Therapist = require('../Models/TherapistModel');
const Patient = require('../Models/PatientModel');

const getSlotsForPatient = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const { day1 } = req.query;
        const patient = await Patient.findById(patientId).exec();
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const therapistId = patient.therapistId;
        if (!therapistId) {
            return res.status(404).json({ message: 'No therapist assigned to this patient' });
        }

        const therapist = await Therapist.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({ message: 'Therapist not found' });
        }
        const options = { timeZone: "Asia/Kolkata", weekday: "long" };
        const today = new Date().toLocaleDateString("en-US", options);
        console.log("today",today);
        console.log(day1);
        if (day1===today) {
            // Filter slots by the provided day
            const availability = therapist.availableTimes.find(
                (time) => time.day.toLowerCase() === day1.toLowerCase()
            );

            if (!availability || !availability.slots.length) {
                return res.json({ availableSlots: [] });
            }

            // Helper function to convert time to minutes
            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };

            // Get current time in IST
            const getCurrentTimeInMinutesIST = () => {
                const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" };
                const date = new Date();
                const timeInIST = new Intl.DateTimeFormat("en-GB", options).format(date);
                const [hours, minutes] = timeInIST.split(":").map(Number);
                return hours * 60 + minutes;
            };
            const currentTimeInMinutes = getCurrentTimeInMinutesIST();

            // Filter slots based on time and availability
            const availableSlots = availability.slots.filter(slot => {
                const slotStartTimeInMinutes = timeToMinutes(slot.startTime);
                return slot.isAvailable && slotStartTimeInMinutes > currentTimeInMinutes;
            });
            return res.json({ availableSlots });
        } else {
            const availability = therapist.availableTimes.find(
                (time) => time.day.toLowerCase() === day1.toLowerCase()
            );
        
            if (!availability || !availability.slots.length) {
                return res.json({ availableSlots: [] });
            }
        
            const availableSlots = availability.slots.filter((slot) => slot.isAvailable);
        
            return res.json({ availableSlots });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getSlotsForPatient };
