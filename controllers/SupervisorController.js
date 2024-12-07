// controllers/SupervisorController.js
const Supervisor = require('../Models/Supervisor_Model');
const { createAccessToken } = require('../utils/auth');
const { verifyPassword } = require('../utils/Password');
const { hashPassword } = require('../utils/Password');

// Register a new supervisor
const registerSupervisor = async (req, res) => {
  const { name, email, password, phone, specialization, image } = req.body;
  // console.log(name, email, password, phone, specialization);
  if (!name || !email || !password || !phone || !specialization) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingSupervisor = await Supervisor.findOne({ email });
    if (existingSupervisor) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await hashPassword(password);

    const newSupervisor = new Supervisor({
      name,
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
      token:token,
			id: supervisor._id,
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

const getMonthlyPatientCounts = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();  // Get current month (0-based index)

    // Month name mapping for matching against the 'month' field in the database
    const monthNameMap = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Aggregation pipeline to calculate patient counts for every month
    const pipeline = [
      {
        $match: {
          'monthlyPatientCounts': { $exists: true, $ne: [] }  // Ensure monthlyPatientCounts field exists
        }
      },
      {
        $unwind: '$monthlyPatientCounts'  // Unwind the array to access each month's data
      },
      {
        $project: {
          month: '$monthlyPatientCounts.month',
          patientCount: '$monthlyPatientCounts.patientCount'
        }
      },
      {
        $group: {
          _id: '$month',  // Group by the month field
          totalPatients: { $sum: '$patientCount' }  // Sum the patientCount for each month
        }
      },
      {
        $sort: { '_id': 1 }  // Sort by month alphabetically
      }
    ];
    

    // Execute the aggregation pipeline
    const results = await Supervisor.aggregate(pipeline);

    // Log the results before sending them
    console.log("Aggregation results:", results);

    // Format the results to match the required output (showing all months even if there are no patients)
    const chartData = monthNameMap.map(monthName => {
      const result = results.find(res => res._id === monthName);
      const totalPatients = result ? result.totalPatients : 0;
      return { month: monthName, patients: totalPatients };
    });

    res.json(chartData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching supervisor data." });
  }
};



module.exports = {
  registerSupervisor,
  loginSupervisor,
  getAllSupervisors,
  getMonthlyPatientCounts
};
