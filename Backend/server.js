const express = require('express');
const mongoose = require('mongoose');
const sessionRoutes = require('./Routes/sessionRoutes');
const Therapist = require('./Models/TherapistModel')

const app = express();
app.use(express.json());

app.use('/api/sessions', sessionRoutes);


mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/SIH?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,    
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));
  
  const testInsert = async () => {
    try {
      await Therapist.create({
        email: "test.therapy@example.com",
        name: "Test Therapy",
        password: "test1234",
        supervisorIds: [new mongoose.Types.ObjectId("605c72ef8c93b4a6c0e77f56")], // Use `new` here
        assignedPatients: [new mongoose.Types.ObjectId("605c72ef8c93b4a6c0e77f7c")], // Use `new` here
        availableTimes: [
          { day: "Monday", startTime: "09:00 AM", endTime: "12:00 PM" },
        ],
        commentsFromSupervisor: [],
      });
      console.log('Test therapist added');
    } catch (err) {
      console.error('Error inserting test data:', err);
    }
  };
  
  testInsert();
  
  
  
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
