const WeeklyReport = require("../models/WeeklyReport");
const Student = require("../models/Student");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const Company = require("../models/Company");

const { calculateProgress } = require("../services/progressService");
const { createNotification } = require(
  "../services/notificationService"
);
const { createAuditLog } = require(
  "../services/auditLogService"
);

// ==========================================
// STUDENT - CREATE WEEKLY REPORT
// ==========================================

const createWeeklyReport = async (req, res) => {
  try {
    const {
      internshipId,
      weekNumber,
      startDate,
      endDate,
      workDone,
      skillsLearned,
      challenges,
      hoursWorked,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !internshipId ||
      weekNumber === undefined ||
      !startDate ||
      !endDate ||
      !workDone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Internship ID, week number, dates and work done are required",
      });
    }

    if (Number(weekNumber) < 1) {
      return res.status(400).json({
        success: false,
        message: "Week number must be at least 1",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    if (
      hoursWorked !== undefined &&
      (Number(hoursWorked) < 0 || Number(hoursWorked) > 168)
    ) {
      return res.status(400).json({
        success: false,
        message: "Hours worked must be between 0 and 168",
      });
    }

    // ==========================================
    // FIND STUDENT
    // ==========================================

    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // ==========================================
    // FIND SELECTED APPLICATION
    // ==========================================

    const application = await Application.findOne({
      internshipId,
      studentId: student._id,
      status: "selected",
    }).populate("companyId");

    if (!application) {
      return res.status(403).json({
        success: false,
        message:
          "You are not selected for this internship",
      });
    }

    // ==========================================
    // CHECK INTERNSHIP
    // ==========================================

    const internship = await Internship.findById(
      internshipId
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    // ==========================================
    // CHECK DUPLICATE WEEKLY REPORT
    // ==========================================

    const existingReport = await WeeklyReport.findOne({
      internshipId,
      studentId: student._id,
      weekNumber,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message:
          "Weekly report for this week already exists",
      });
    }

    // ==========================================
    // CREATE REPORT
    // ==========================================

    const report = await WeeklyReport.create({
      internshipId,
      studentId: student._id,
      weekNumber,
      startDate,
      endDate,
      workDone,
      skillsLearned: Array.isArray(skillsLearned)
        ? skillsLearned
        : [],
      challenges,
      hoursWorked,
    });

    // ==========================================
    // CALCULATE PROGRESS
    // ==========================================

    const progress = await calculateProgress(
      internshipId,
      student._id
    );

    // ==========================================
    // NOTIFY COMPANY
    // ==========================================

    if (
      application.companyId &&
      application.companyId.userId
    ) {
      await createNotification({
        recipient: application.companyId.userId,
        title: "Weekly Report Submitted",
        message: `Student ${student.studentId} submitted Week ${weekNumber} report.`,
        type: "report",
        relatedId: report._id,
      });
    }

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "WEEKLY_REPORT_SUBMITTED",
      entityType: "WeeklyReport",
      entityId: report._id,
      description: `Student ${student.studentId} submitted Week ${weekNumber} weekly report`,
      metadata: {
        internshipId,
        weekNumber,
        hoursWorked: hoursWorked || 0,
      },
      ipAddress: req.ip,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message: "Weekly report submitted successfully",
      report,
      progress,
    });
  } catch (error) {
    console.error(
      "Create weekly report error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to submit weekly report",
      error: error.message,
    });
  }
};

// ==========================================
// STUDENT - GET MY REPORTS
// ==========================================

const getMyWeeklyReports = async (req, res) => {
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

    const reports = await WeeklyReport.find({
      studentId: student._id,
    })
      .populate(
        "internshipId",
        "title companyId startDate endDate"
      )
      .sort({
        internshipId: 1,
        weekNumber: -1,
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error(
      "Get reports error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly reports",
      error: error.message,
    });
  }
};

// ==========================================
// COMPANY / PLACEMENT CELL
// GET REPORTS FOR AN INTERNSHIP
// ==========================================

const getInternshipWeeklyReports = async (
  req,
  res
) => {
  try {
    const { internshipId } = req.params;

    // ==========================================
    // FIND INTERNSHIP
    // ==========================================

    const internship = await Internship.findById(
      internshipId
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    // ==========================================
    // COMPANY OWNERSHIP CHECK
    // ==========================================

    if (req.user.role === "company") {
      const company = await Company.findOne({
        userId: req.user._id,
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company profile not found",
        });
      }

      if (
        internship.companyId.toString() !==
        company._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view these reports",
        });
      }
    }

    // ==========================================
    // GET REPORTS
    // ==========================================

    const reports = await WeeklyReport.find({
      internshipId,
    })
      .populate(
        "studentId",
        "studentId department year"
      )
      .sort({
        weekNumber: 1,
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      internship: {
        id: internship._id,
        title: internship.title,
        companyId: internship.companyId,
      },
      reports,
    });
  } catch (error) {
    console.error(
      "Get internship reports error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch internship reports",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createWeeklyReport,
  getMyWeeklyReports,
  getInternshipWeeklyReports,
};
