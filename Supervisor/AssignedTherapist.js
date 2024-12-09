const Supervisor = require("../Models/SupervisorModel");
const Therapist = require("../Models/TherapistModel");
const Patient = require("../Models/PatientModel");

const AssignedTherapist = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    if (!supervisorId) {
      return res.status(400).send("Supervisor ID is required");
    }

    const supervisor = await Supervisor.findById(supervisorId).populate("therapistIds").exec();
    if (!supervisor) {
      return res.status(404).send("Supervisor not found");
    }

    const therapists = await Therapist.find({ _id: { $in: supervisor.therapistIds } })
      .select("name photo course department assignedPatients")
      .exec();

    const therapistsData = await Promise.all(
      therapists.map(async (therapist) => {
        const patients = await Patient.find({ _id: { $in: therapist.assignedPatients } }).exec();
        return {
          id: therapist._id,
          name: therapist.name,
          photo: therapist.photo,
          course: therapist.course || "Not specified",
          department: therapist.department || "Not specified",
          patients: patients.map((p) => ({ id: p._id, name: p.name, photo: p.photo })),
        };
      })
    );

    res.status(200).json(therapistsData);
  } catch (error) {
    res.status(500).send("An error occurred while fetching therapists");
  }
};

module.exports = {
  AssignedTherapist,
};

const updateSupervisorById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log("ID", id);
    console.log("hi", updatedData);
    const supervisor = await Supervisor.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    console.log(supervisor);
    if (!supervisor) {
      return res.status(404).json({ message: "supervisor not found" });
    }

    res
      .status(200)
      .json({ message: "supervisor updated successfully", patient });
  } catch (error) {
    res.status(500).json({ message: "Error updating supervisor", error });
  }
};


const getSupervisorById = async (req, res) => {
  console.log("getsupervisorById");
  try {
    const { id } = req.params;
    console.log("ID", id);

    const supervisor = await Supervisor.findById(id);
    if (!supervisor) {
      return res.status(404).json({ message: "supervisor not found" });
    }

    res.status(200).json({ supervisor });
  } catch (error) {
    res.status(500).json({ message: "Error fetching supervisor", error });
  }
};

module.exports = {
  AssignedTherapist,
  getSupervisorById,
  updateSupervisorById,
};
