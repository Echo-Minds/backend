const Therapist = require('../Models/TherapistModel')

const getAssignedPatients = async (req, res) => {
    const { therapistId } = req.query; 
    try {
        const therapist = await Therapist.findById(therapistId).exec(); 
        if (!therapist) {
            return res.status(404).send("Therapist not found");
        }
        const assignedPatients = therapist.assignedPatients;
        res.status(200).send(assignedPatients);
    } catch (error) {
        res.status(500).send("Error fetching assigned patients");
    }
};

module.exports = getAssignedPatients;