const Student = require("../models/Student");

// Get logged-in student's profile
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user._id,
    }).populate("userId", "name email role");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Get student profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Create student profile
const createProfile = async (req, res) => {
  try {
    const {
      studentId,
      phone,
      department,
      year,
      batch,
      semester,
      cgpa,
      backlogs,
      skills,
      projects,
      certifications,
    } = req.body;

    // Check if profile already exists
    const existingProfile = await Student.findOne({
      userId: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Student profile already exists",
      });
    }

    // Check student ID
    const existingStudentId = await Student.findOne({
      studentId,
    });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists",
      });
    }

    const student = await Student.create({
      userId: req.user._id,
      studentId,
      phone,
      department,
      year,
      batch,
      semester,
      cgpa,
      backlogs,
      skills,
      projects,
      certifications,
    });

    res.status(201).json({
      success: true,
      message: "Student profile created successfully",
      student,
    });
  } catch (error) {
    console.error("Create student profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update logged-in student's profile
const updateMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const allowedFields = [
      "phone",
      "department",
      "year",
      "batch",
      "semester",
      "cgpa",
      "backlogs",
      "skills",
      "projects",
      "certifications",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      student,
    });
  } catch (error) {
    console.error("Update student profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// PLACEMENT CELL - GET ALL STUDENTS
// ==========================================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate(
        "userId",
        "name email role isActive"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "Get all students error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getAllStudents,
};