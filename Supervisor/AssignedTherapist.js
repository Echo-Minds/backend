const Supervisor = require('../Models/SupervisorModel')
const Therapists = require('../Models/TherapistModel');

const AssignedTherapist = async (req, res) => {
    try {
        const { supervisorId } = req.body;
        if (!supervisorId) {
            return res.status(400).send("Supervisor ID is required");
        }

        const supervisor = await Supervisor.findById(supervisorId).populate('therapistIds').exec();
        console.log("HI");
        if (!supervisor) {
            return res.status(404).send("Supervisor not found in the database");
        }
        console.log(supervisor);
        const therapistsDetails = await Therapists.find({
            _id: { $in: supervisor.therapistIds }
        }).select('name assignedPatients').exec();

        const result = therapistsDetails.map(therapist => ({
            name: therapist.name,
            assignedPatientsCount: therapist.assignedPatients.length,
        }));

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while fetching therapists");
    }
};

module.exports = {
    AssignedTherapist,
};