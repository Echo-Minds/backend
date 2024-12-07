// therapistController.js

const Therapist = require("../Models/Therapist_Model"); // Import the Therapist model
const { hashPassword, verifyPassword } = require("../utils/Password"); // For password operations
const { createAccessToken } = require("../utils/auth"); // For JWT token generation

const registerTherapist = async (req, res) => {
  try {
    const { name, email, password, phone, course, department, image } =
      req.body;

    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const defaultAvailableTimes = days.map((day) => ({
      day,
      slots: Array.from({ length: 8 }, (_, i) => ({
        startTime: `${8 + i}:00`,
        endTime: `${9 + i}:00`,
        isAvailable: true,
      })),
    }));
    const newTherapist = new Therapist({
      name,
      email,
      password: hashedPassword,
      phone,
      course,
      department,
      image,
      availableTimes: defaultAvailableTimes
    });

    await newTherapist.save();

    res
      .status(201)
      .json({ message: "Registration successful", therapistId: newTherapist._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering therapist", error });
  }
};

const loginTherapist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(password, therapist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createAccessToken({
      id: therapist._id,
      email: therapist.email,
    });

    res
      .status(200)
      .json({ message: "Login successful", token: token, id: therapist._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get all therapists (protected route)
const getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({});
    res.status(200).json({ therapists });
  } catch (error) {
    res.status(500).json({ message: "Error fetching therapists", error });
  }
};
// Assuming you've defined the Therapist model

const getAverageGrades = async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Calculate the last 6 months
        const lastSixMonths = [];
        for (let i = 5; i >= 0; i--) {
            const month = currentMonth - i;
            lastSixMonths.push({
                year: month < 0 ? currentYear - 1 : currentYear,
                month: (month + 12) % 12
            });
        }

        // Month name mapping
        const monthNameMap = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Aggregation pipeline to filter and calculate average grades
        const pipeline = [
            {
                $match: {
                    'grades': { $exists: true, $ne: [] }
                }
            },
            {
                $project: {
                    grades: 1
                }
            },
            {
                $unwind: '$grades'  // Unwind the grades array to access each grade object
            },
            {
                $match: {
                    'grades.year': { $in: lastSixMonths.map(month => month.year) },
                    'grades.month': { $in: lastSixMonths.map(month => monthNameMap[month.month]) }
                }
            },
            {
                $group: {
                    _id: {
                        month: '$grades.month',
                        year: '$grades.year'
                    },
                    averageGrade: { $avg: '$grades.grade' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ];

        // Execute the aggregation pipeline
        const results = await Therapist.aggregate(pipeline);

        // Format the results to match the required output
        const chartData = lastSixMonths.map(({ year, month }) => {
            const monthName = monthNameMap[month];
            const result = results.find(res => res._id.month === monthName && res._id.year === year);
            const averageGrade = result ? result.averageGrade : 0;
            return { month: monthName, averageGrade };
        });

        res.json(chartData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching therapist data." });
    }
};

const getRecentSessions = async (req, res) => {
  try {
    // Get the current date and 7 days ago
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));

    // Perform the aggregation pipeline
    const therapists = await Therapist.aggregate([
      // Step 1: Match therapists who have a sessions field
      {
        $match: {
          sessions: { $exists: true, $ne: [] }, // Only process documents where `sessions` exists and is not empty
        },
      },
      // Step 2: Unwind the sessions array
      {
        $unwind: "$sessions",
      },
      // Step 3: Filter sessions to include only those within the last 7 days
      {
        $match: {
          "sessions.date": { $gte: sevenDaysAgo, $lte: today }, // Filter for sessions within the last 7 days
        },
      },
      // Step 4: Aggregate session data fields (sum them up)
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          supervisorIds: { $first: "$supervisorIds" },
          totalSessionsBooked: { $sum: "$sessions.data.sessionsBooked" },
          totalSessionsCancelled: { $sum: "$sessions.data.sessionsCancelled" },
          totalSessionsConducted: { $sum: "$sessions.data.sessionsConducted" },
          totalSessionsConductedOnline: { $sum: "$sessions.data.sessionsConductedOnline" },
          totalSessionsConductedOffline: { $sum: "$sessions.data.sessionsConductedOffline" },
        },
      },
      // Optional Step 5: Reformat or project the fields if needed
      {
        $project: {
          name: 1,
          supervisorIds: 1,
          totalSessionsBooked: 1,
          totalSessionsCancelled: 1,
          totalSessionsConducted: 1,
          totalSessionsConductedOnline: 1,
          totalSessionsConductedOffline: 1,
        },
      },
    ]);

    // Return the aggregated data
    res.json(therapists);
  } catch (error) {
    console.error("Error fetching recent sessions:", error);
    res.status(500).json({ error: "An error occurred while fetching the data." });
  }
};

module.exports = { getRecentSessions,registerTherapist,loginTherapist,getAllTherapists,getAverageGrades };

