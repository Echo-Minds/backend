const Patient = require('../Models/Patient_model');
const { hashPassword, verifyPassword } = require('../utils/Password');
const { createAccessToken } = require('../utils/auth');

// Register a new patient
exports.registerPatient = async (req, res) => {
  const { name, email, phone, age, gender, goals, password } = req.body;
 
	const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Email is already registered" });
    }

  try {
    const hashedPassword = await hashPassword(password);
    const newPatient = new Patient({
      name,
      email,
      phone,
      age,
      gender,
      goals,
      password: hashedPassword,
    });

    await newPatient.save();
    res.status(200).json({ message: 'Patient registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
};

// Login patient and generate JWT
exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient || !(await verifyPassword(password, patient.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createAccessToken({ email: patient.email });
    res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      id: patient._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get patient info
exports.getPatientInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patient_id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient info', error: error.message });
  }
};
