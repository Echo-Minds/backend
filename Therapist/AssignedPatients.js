const Therapist = require("../Models/TherapistModel");
const Patient = require("../Models/PatientModel");

const assignedPatients = async (req, res) => {
  try {
    const therapistId = req.query.therapistId;
    console.log(therapistId);
    if (!therapistId) {
      return res.status(404).send("Therapist id is required");
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).send("Therapist not found");
    }

    const assignedPatients = therapist.assignedPatients || [];
    const patientData = await Promise.all(
      assignedPatients.map(async (patientId) => {
        const patient = await Patient.findById(patientId);
        if (!patient) {
          throw new Error(`Patient with ID ${patientId} not found`);
        }
        return { name: patient.name, id: patient._id }; // Return an object
      })
    );

    return res.status(200).json({ patientData });
  } catch (error) {
    res.status(500).send(error.message || "An error occurred");
  }
};

module.exports = {
  assignedPatients,
};
