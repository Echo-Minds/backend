const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const sessionRoutes = require('./Routes/sessionRoutes');
const Patient = require('./Models/PatientModel');
const Therapist = require('./Models/TherapistModel');
const Notification = require('./Models/NotificationModel');
const therapistRoutes = require('./Routes/TherapistRoutes');

const patientRoutes = require('./Routes/PatientRoutes');
const supervisorRoutes = require('./Routes/SupervisorRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/sessions', sessionRoutes);

app.use(bodyParser.json());
app.use('/api/patient', patientRoutes);
app.use('/api/therapist', therapistRoutes);
app.use('/api/supervisor', supervisorRoutes);

mongoose.connect(
  'mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/SIH',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id).exec();
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const enrichedPatient = {
      ...patient.toObject(),
      progress: 75,
      goalDescription: `Improving ${patient.goal} through daily exercises`,
    };
    res.json(enrichedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient data', error });
  }
});

app.get('/getName', async (req, res) => {
  const { id } = req.query;
  try {
    const therapist = await Therapist.findById(id).exec();
    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }
    res.json(therapist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching therapist name', error });
  }
});

app.get('/api/notifications/:userType/:id', async (req, res) => {
  const { userType, id } = req.params;

  try {
    // Query based on user type
    const query =
      userType === 'patient'
        ? { patientId: id }
        : userType === 'therapist'
        ? { therapistId: id }
        : { supervisorId: id };

    const notifications = await Notification.find(query).sort({ timestamp: -1 }).exec();

    // Transform notifications to user-centric messages
    const userCentricNotifications = notifications.map((notif) => {
      const sessionDate = notif.message.match(/\d{4}-\d{2}-\d{2}/)?.[0];
      const sessionTime = notif.message.match(/\d{2}:\d{2}:\d{2}/)?.[0];
      const sessionWith = notif.message.split("with")[1]?.split("scheduled")[0]?.trim();
      const supervisorName = notif.message.split("Supervisor")[1]?.split("has")[0]?.trim();

      if (notif.type === "Session Scheduled") {
        if (userType === 'patient') {
          return {
            ...notif.toObject(),
            message: notif.message, // No changes for patients
          };
        } else if (userType === 'therapist') {
          return {
            ...notif.toObject(),
            message: `Dear Therapist, you have a session with Patient ${sessionWith} scheduled on ${sessionDate} at ${sessionTime}.`,
          };
        } else if (userType === 'supervisor') {
          return {
            ...notif.toObject(),
            message: `Supervisor, Therapist ${sessionWith} has a session with Patient ID ${notif.patientId} scheduled on ${sessionDate} at ${sessionTime}.`,
          };
        }
      }

      if (notif.type === "Session Cancelled") {
        if (userType === 'patient') {
          return {
            ...notif.toObject(),
            message: notif.message, // No changes for patients
          };
        } else if (userType === 'therapist') {
          return {
            ...notif.toObject(),
            message: `Dear Therapist, the session with Patient ${sessionWith} scheduled on ${sessionDate} at ${sessionTime} has been cancelled.`,
          };
        } else if (userType === 'supervisor') {
          return {
            ...notif.toObject(),
            message: `Supervisor, the session between Therapist ${sessionWith} and Patient ID ${notif.patientId} scheduled on ${sessionDate} at ${sessionTime} has been cancelled.`,
          };
        }
      }

      if (notif.type === "rejected") {
        if (userType === 'therapist') {
          return {
            ...notif.toObject(),
            message: notif.message, // No changes for therapists
          };
        } else if (userType === 'supervisor') {
          return {
            ...notif.toObject(),
            message: `Supervisor, the request from Therapist ${id} has been rejected.`,
          };
        }
      }

      if (notif.type === "accepted") {
        if (userType === 'therapist') {
          return {
            ...notif.toObject(),
            message: notif.message, // No changes for therapists
          };
        } else if (userType === 'supervisor') {
          return {
            ...notif.toObject(),
            message: `Supervisor, the request from Therapist ${id} has been accepted.`,
          };
        }
      }

      return notif; // Default case for unhandled notification types
    });

    res.json(userCentricNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
