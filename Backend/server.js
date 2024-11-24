const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sessionRoutes = require('./Routes/sessionRoutes');
const Patient = require('./Models/PatientModel');
const Therapist = require('./Models/TherapistModel');
const Notification = require('./Models/NotificationModel');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessionRoutes);

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
    const query = userType === 'patient' ? { patientId: id } : { therapistId: id };
    const notifications = await Notification.find(query).sort({ timestamp: -1 }).exec();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

app.patch('/api/notifications/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { type, message, patientId, therapistId, timestamp } = req.body;
  try {
    const newNotification = new Notification({
      type,
      message,
      patientId,
      therapistId,
      timestamp,
      isRead: false, 
    });
    await newNotification.save();
    res.status(201).json({ message: 'Notification added successfully', notification: newNotification });
  } catch (error) {
    res.status(500).json({ message: 'Error adding notification', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
