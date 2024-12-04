// therapistController.js

const Therapist = require("../Models/Therapist_Model"); // Import the Therapist model
const { hashPassword, verifyPassword } = require("../utils/Password"); // For password operations
const { createAccessToken } = require("../utils/auth"); // For JWT token generation

// Register a therapist
exports.registerTherapist = async (req, res) => {
  try {
    const { name, email, password, phone, course, department, image } =
      req.body;

    // Check if therapist with the same email already exists
    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new therapist record
    const newTherapist = new Therapist({
      name,
      email,
      password: hashedPassword,
      phone,
      course,
      department,
      image,
    });

    await newTherapist.save();

    res
      .status(201)
      .json({ message: "Registration successful", therapist: newTherapist });
  } catch (error) {
    res.status(500).json({ message: "Error registering therapist", error });
  }
};

// Login a therapist
exports.loginTherapist = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the therapist exists
    const therapist = await Therapist.findOne({ email });
    if (!therapist) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, therapist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate an access token
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
exports.getAllTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({});
    res.status(200).json({ therapists });
  } catch (error) {
    res.status(500).json({ message: "Error fetching therapists", error });
  }
};
