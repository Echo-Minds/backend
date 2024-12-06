const Supervisor = require('../Models/SupervisorModel');

const getSupervisorNames = async (req, res) => {
  try {
    const supervisors = await Supervisor.find({}, '_id name');

    res.status(200).json({
      success: true,
      data: supervisors,
    });
  } catch (error) {
    console.error('Error fetching supervisor names:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supervisor names',
    });
  }
};

module.exports = {
  getSupervisorNames,
};
