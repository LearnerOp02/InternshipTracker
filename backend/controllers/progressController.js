const InternshipProgress = require("../models/InternshipProgress");
const Student = require("../models/Student");
const Internship = require("../models/Internship");
const Company = require("../models/Company");

const { calculateProgress } = require("../services/progressService");

// ==========================================
// STUDENT - GET MY INTERNSHIP PROGRESS
// ==========================================

const getMyProgress = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const internship = await Internship.findById(
      internshipId
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    const progress = await calculateProgress(
      internshipId,
      student._id
    );

    res.json({
      internship: {
        id: internship._id,
        title: internship.title,
      },
      progress,
    });
  } catch (error) {
    console.error("Get my progress error:", error);

    res.status(500).json({
      message: "Failed to fetch internship progress",
      error: error.message,
    });
  }
};

// ==========================================
// COMPANY / PLACEMENT CELL - GET PROGRESS
// ==========================================

const getInternshipProgress = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findById(
      internshipId
    );

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found",
      });
    }

    const progressRecords =
      await InternshipProgress.find({
        internshipId,
      })
        .populate(
          "studentId",
          "studentId department year cgpa"
        )
        .sort({ percentage: -1 });

    res.json({
      count: progressRecords.length,
      progress: progressRecords,
    });
  } catch (error) {
    console.error(
      "Get internship progress error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch internship progress",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProgress,
  getInternshipProgress,
};