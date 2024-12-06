const Patient = require("../Models/PatientModel");

const assignTask = async (req, res) => {
  try {
    const { patientId, task } = req.body;

    if (!patientId || !task) {
      return res.status(400).send("Patient ID and task are required.");
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).send("Patient not found.");
    }

    if (!patient.exercises) {
      patient.exercises = [];
    }

    patient.exercises.push(task);

    await patient.save();

    return res.status(200).send("Task assigned successfully.");
  } catch (error) {
    return res.status(500).send(error.message || "An error occurred");
  }
};

module.exports = {
  assignTask,
};
