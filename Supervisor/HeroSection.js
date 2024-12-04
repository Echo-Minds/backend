const Patient = require('../Models/PatientModel')
const Therapist = require('../Models/TherapistModel')

const noOfPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).send({ count: patients.length });
    } catch (error) {
        res.status(500).send({ message: "Error fetching patients", error });
    }
};


const noOfTherapist = async (req, res) => {
    try {
        const therapists = await Therapist.find();
        res.status(200).send({ count: therapists.length }); 
    } catch (error) {
        res.status(500).send({ message: "Error fetching therapists", error });
    }
};

const totalSessions = async (req, res) => {
    try {
        const patients = await Patient.find();
        const totalSessions = patients.reduce((sum, patient) => sum + (patient.noOfSessions || 0), 0)
        res.status(200).send({ totalSessions });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = {
    noOfPatients,
    noOfTherapist,
    totalSessions
}