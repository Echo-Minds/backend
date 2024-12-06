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


const updatePatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log("ID",id);
    console.log("hi",updatedData);
    const patient = await Patient.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log(patient);
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    res.status(200).json({ message: "patient updated successfully",patient });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error });
  }
};

const getPatientById = async (req, res) => {
	console.log("getPatientById");
  try {
    const { id } = req.params;
		console.log("ID",id);

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error });
  }
};

module.exports = {
  getExercises,
	updatePatientById,
	getPatientById
};
