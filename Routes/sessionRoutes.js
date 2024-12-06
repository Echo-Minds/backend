const express = require("express");
const { handleSessionRating } = require("../controllers/ReAssign");
const { scheduleSession } = require("../controllers/SessionSchedular");
const { assignPatientToTherapist } = require("../controllers/Assignment");
const { getSlotsForPatient } = require("../controllers/AvailableSlots");
const nextAppointment = require("../controllers/nextAppointment");
const getAssignedPatients = require("../controllers/getAssignedPatients");
const getPatientList = require("../controllers/PatientList");
const deleteSession = require("../controllers/DeleteSessions");
const { formHandler } = require("../controllers/FormHandler");
const { markRead } = require("../controllers/MarkRead");
const { AssignedTherapist } = require("../Supervisor/AssignedTherapist");
const {
  noOfPatients,
  noOfTherapist,
  totalSessions,
} = require("../Supervisor/HeroSection");
const { assignedPatients, getTherapistById, updateTherapistById } = require("../Therapist/AssignedPatients");
const { assignTask } = require("../Therapist/AssignTask");
const { getExercises } = require("../Patient/getExercise");
const { getSupervisorNames } = require("../Therapist/SupervisorList");

const router = express.Router();

router.post("/schedule", scheduleSession);
router.post("/assign", assignPatientToTherapist);
router.post("/reassign", handleSessionRating);
router.post("/formupdate", formHandler);
router.post("/markunread", markRead);
router.delete("/delete", deleteSession);
router.get("/getExercise/:patientId", getExercises);
router.put("/therapist/:id",updateTherapistById);
router.get("/patient/:patientId/availableSlots", getSlotsForPatient);
router.get("/nextAppointment", nextAppointment);
router.get("/assignedPatients", getAssignedPatients);
router.get("/patientDetails", getPatientList);
router.get("/assignedTherapist", AssignedTherapist);
router.get("/supervisorDetails", getSupervisorNames)
router.get("/noOfPatients", noOfPatients);
router.get("/noOfTherapists", noOfTherapist);
router.get("/totalSessions", totalSessions);
router.get("/therapist/:id", getTherapistById);
router.get("/patientName", assignedPatients);
router.post("/assignTask", assignTask);

module.exports = router;
