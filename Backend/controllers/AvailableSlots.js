const Therapist = require('../Models/TherapistModel');
const Patient = require('../Models/PatientModel');

const getSlotsForPatient = async (req, res) => {
    try {
        console.log("HI");
        const patientId = req.params.patientId;
        console.log(patientId);
        const { day } = req.query;
        console.log(day);
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

        const availability = therapist.availableTimes.find(
            (time) => time.day.toLowerCase() === day.toLowerCase()
        );

        if (!availability || !availability.slots.length) {
            return res.json({ availableSlots: [] });
        }

        const availableSlots = availability.slots.filter(slot => slot.isAvailable);

        res.json({ availableSlots });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { getSlotsForPatient };
