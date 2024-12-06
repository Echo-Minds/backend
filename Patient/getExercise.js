const Patient = require("../Models/PatientModel"); // Assuming Patient model exists

// Controller to get exercises for a specific patient
const getExercises = async (req, res) => {
  try {
    const { patientId } = req.params; // Extract patientId from URL parameters

    if (!patientId) {
      return res.status(400).send("Patient ID is required.");
    }

    // Fetch patient by ID and only select the 'exercises' field
    const patient = await Patient.findById(patientId).select("exercises");

    if (!patient) {
      return res.status(404).send("Patient not found.");
    }

    return res.status(200).json({ exercises: patient.exercises });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return res.status(500).send(error.message || "An error occurred");
  }
};

module.exports = {
  getExercises,
};
