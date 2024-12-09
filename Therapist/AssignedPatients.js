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

const getTherapistById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the therapist by ID
    const therapist = await Therapist.findById(id);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Fetch patient details using their ObjectIds
    const patients = await Patient.find({
      _id: { $in: therapist.assignedPatients },
    });

    // Respond with the therapist details and the patients array
    res.status(200).json({
      therapist: {
        ...therapist.toObject(),
        patients,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching therapist", error });
  }
};

const updateTherapistById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log("ID",id);
    console.log("hi",updatedData);
    const therapist = await Therapist.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log(therapist);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    res.status(200).json({ message: "Therapist updated successfully", therapist });
  } catch (error) {
    res.status(500).json({ message: "Error updating therapist", error });
  }
};


module.exports = {
  assignedPatients,
  getTherapistById,
  updateTherapistById
};
