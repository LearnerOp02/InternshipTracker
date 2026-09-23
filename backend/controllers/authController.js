const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const Student = require("../models/Student");
const Company = require("../models/Company");

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // Only public registration roles
    const allowedRoles = [
      "student",
      "company",
    ];

    const selectedRole =
      role || "student";

    if (
      !allowedRoles.includes(selectedRole)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid registration role",
      });
    }

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: selectedRole,
    });

    try {
      // ========================================
      // CREATE STUDENT PROFILE
      // ========================================

      if (
        selectedRole === "student"
      ) {
        const studentId =
          `STU${user._id
            .toString()
            .slice(-8)
            .toUpperCase()}`;

        await Student.create({
          userId: user._id,
          studentId,
        });
      }

    } catch (profileError) {
      // If profile creation fails,
      // remove the user so no incomplete account remains
      await User.findByIdAndDelete(
        user._id
      );

      console.error(
        "Profile creation error:",
        profileError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create user profile",
      });
    }

    // ========================================
    // CREATE COMPANY PROFILE
    // ========================================

    if (selectedRole === "company") {
      await Company.create({
        userId: user._id,

        // Use registration name initially
        // Company can update it later from profile
        companyName: name,

        contactPerson: name,
        contactEmail: email,

        verificationStatus: "pending",
      });
    }
    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message:
        "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during registration",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};