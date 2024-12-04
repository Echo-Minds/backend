// controllers/SupervisorController.js
const Supervisor = require('../Models/Supervisor_Model');
const { createAccessToken } = require('../utils/auth');
const { verifyPassword } = require('../utils/Password');
const { hashPassword } = require('../utils/Password');

// Register a new supervisor
const registerSupervisor = async (req, res) => {
  const { fullname, email, password, phone, specialization, image } = req.body;
  // console.log(fullname, email, password, phone, specialization);
  if (!fullname || !email || !password || !phone || !specialization) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingSupervisor = await Supervisor.findOne({ email });
    if (existingSupervisor) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await hashPassword(password);

    const newSupervisor = new Supervisor({
      fullname,
      email,
      password: hashedPassword,
      phone,
      specialization,
      image,
    });

    await newSupervisor.save();
    res.status(201).json({ message: 'Supervisor registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error});
  }
};

// Login supervisor
const loginSupervisor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const supervisor = await Supervisor.findOne({ email });
    console.log(supervisor);
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found.' });
    }
    // console.log("entered supervisor");

    const isPasswordValid = await verifyPassword(password, supervisor.password);
    // console.log(isPasswordValid);
    // console.log(await hashPassword(password),supervisor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Create JWT token
    const token = createAccessToken({ supervisorId: supervisor._id, email: supervisor.email });

    res.status(200).json({
      message: 'Login successful.',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error.', error});
  }
};

// Get all supervisors (requires authentication)
const getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find();
    res.status(200).json({ supervisors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supervisors.', error });
  }
};

module.exports = {
  registerSupervisor,
  loginSupervisor,
  getAllSupervisors,
};
