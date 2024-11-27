const mongoose = require('mongoose');
const Patient = require('../Models/PatientModel');
const Therapist = require('../Models/TherapistModel');

const assignPatientToTherapist = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).send({ error: "Invalid patientId format" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    if (patient.therapistId) {
      return res.status(400).send({
        error: `Patient ${patient.name} is already assigned to a therapist`,
      });
    }

    const therapists = await Therapist.find();
    if (!therapists || therapists.length === 0) {
      return res.status(404).send({ error: "No therapists available" });
    }

    let therapistWithLeastPatients = therapists.reduce((prev, curr) => {
      return prev.assignedPatients.length < curr.assignedPatients.length ? prev : curr;
    });

    patient.therapistId = therapistWithLeastPatients._id;
    await patient.save();

    therapistWithLeastPatients.assignedPatients.push(patient._id);
    await therapistWithLeastPatients.save();

    res.status(200).send({
      message: `Patient ${patient.name} successfully assigned to therapist ${therapistWithLeastPatients.name}`,
    });
  } catch (error) {
    console.error("Error assigning patient:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  assignPatientToTherapist,
};
