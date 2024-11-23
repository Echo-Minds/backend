const express = require('express');
const mongoose = require('mongoose');
const sessionRoutes = require('./Routes/sessionRoutes');
const Patient = require('./Models/PatientModel')
const therapist = require('./Models/TherapistModel');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/sessions', sessionRoutes);


mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/SIH', {
    useNewUrlParser: true,    
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));


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
  app.get('/getName', async (req,res)=>{
    const {id} = req.query;
    try{
      const name = await therapist.findById(id).exec();
      if(!name){
        return res.status(404).json({message: "Therapist not found"});
      }
      res.json(name);
    }catch(error){
      res.status(500).json({message:"error fetching therapist name", error});
    }
  })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
