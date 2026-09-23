const Application = require("../models/Application");
const Student = require("../models/Student");
const Internship = require("../models/Internship");
const Company = require("../models/Company");

const checkEligibility = require("../services/eligibilityService");
const { createNotification } = require("../services/notificationService");
const { createAuditLog } = require("../services/auditLogService");

// ==========================================
// APPLY FOR INTERNSHIP
// ==========================================
const applyForInternship = async (req, res) => {
  try {
    // Find student profile
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Find published internship
    const internship = await Internship.findOne({
      _id: req.params.internshipId,
      status: "published",
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    // Check application deadline
    if (
      internship.applicationDeadline &&
      new Date(internship.applicationDeadline) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // Check eligibility
    const eligibility = checkEligibility(
      student,
      internship
    );

    if (!eligibility.eligible) {
      return res.status(403).json({
        success: false,
        message: "You are not eligible for this internship",
        reasons: eligibility.reasons,
        missingSkills: eligibility.missingSkills,
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      studentId: student._id,
      internshipId: internship._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this internship",
      });
    }

    // Create application
    const application = await Application.create({
      studentId: student._id,
      internshipId: internship._id,
      companyId: internship.companyId,
      resumeUrl: req.body.resumeUrl,
      status: "applied",
    });

    // Find company
    const company = await Company.findById(
      internship.companyId
    );

    // Notify company
    if (company && company.userId) {
      await createNotification({
        recipient: company.userId,
        title: "New Internship Application",
        message: `A student has applied for your internship: ${internship.title}.`,
        type: "application",
        relatedId: application._id,
      });
    }

    // Audit log
    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "APPLICATION_SUBMITTED",
      entityType: "Application",
      entityId: application._id,
      description: `Student submitted an application for internship: ${internship.title}.`,
      metadata: {
        internshipId: internship._id,
        companyId: internship.companyId,
        status: application.status,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Apply for internship error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET MY APPLICATIONS
// ==========================================
const getMyApplications = async (req, res) => {
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

    const applications = await Application.find({
      studentId: student._id,
    })
      .populate(
        "internshipId",
        "title description duration stipend location workMode applicationDeadline status"
      )
      .populate(
        "companyId",
        "companyName industry location"
      )
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get my applications error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET SINGLE APPLICATION
// ==========================================
const getMyApplicationById = async (req, res) => {
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

    const application = await Application.findOne({
      _id: req.params.id,
      studentId: student._id,
    })
      .populate(
        "internshipId",
        "title description duration stipend location workMode applicationDeadline status"
      )
      .populate(
        "companyId",
        "companyName industry location website"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET APPLICANTS FOR AN INTERNSHIP
// Company can only see applicants
// for its own internship
// ==========================================
const getInternshipApplicants = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const internship = await Internship.findOne({
      _id: req.params.internshipId,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    const applications = await Application.find({
      internshipId: internship._id,
      companyId: company._id,
    })
      .populate(
        "studentId",
        "studentId phone department year batch semester cgpa backlogs skills projects certifications resume"
      )
      .sort({ appliedAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get internship applicants error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
const updateApplicationStatus = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const application = await Application.findById(
      req.params.id
    ).populate("internshipId", "title");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Company ownership check
    if (
      application.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this application",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "under_review",
      "shortlisted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Prevent changing already selected application
    if (application.status === "selected") {
      return res.status(400).json({
        success: false,
        message: "Selected application status cannot be changed",
      });
    }

    const oldStatus = application.status;

    application.status = status;

    await application.save();

    // Find student
    const student = await Student.findById(
      application.studentId
    );

    // Notify student
    if (student && student.userId) {
      const statusMessages = {
        under_review:
          "Your application is now under review.",

        shortlisted:
          "Congratulations! You have been shortlisted for the internship.",

        rejected:
          "Your internship application has been rejected.",
      };

      await createNotification({
        recipient: student.userId,
        title: "Application Status Updated",
        message:
          statusMessages[status] ||
          `Your application status changed to ${status}.`,
        type: "application",
        relatedId: application._id,
      });
    }

    // Audit log
    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "APPLICATION_STATUS_UPDATED",
      entityType: "Application",
      entityId: application._id,
      description: `Application status changed from ${oldStatus} to ${status}.`,
      metadata: {
        previousStatus: oldStatus,
        newStatus: status,
        studentId: application.studentId,
        internshipId: application.internshipId._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// SCHEDULE INTERVIEW
// ==========================================
const scheduleInterview = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Company ownership check
    if (
      application.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this application",
      });
    }

    // Only shortlisted candidates
    if (application.status !== "shortlisted") {
      return res.status(400).json({
        success: false,
        message:
          "Only shortlisted candidates can be scheduled for an interview",
      });
    }

    const {
      scheduledAt,
      mode,
      meetingLink,
      location,
      notes,
    } = req.body;

    if (!scheduledAt || !mode) {
      return res.status(400).json({
        success: false,
        message: "Interview date/time and mode are required",
      });
    }

    const interviewDate = new Date(scheduledAt);

    // Check valid date
    if (Number.isNaN(interviewDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview date/time",
      });
    }

    // Interview must be in future
    if (interviewDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Interview date/time must be in the future",
      });
    }

    // Validate mode
    if (!["online", "offline"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Interview mode must be online or offline",
      });
    }

    // Online interview
    if (mode === "online" && !meetingLink) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link is required for online interview",
      });
    }

    // Offline interview
    if (mode === "offline" && !location) {
      return res.status(400).json({
        success: false,
        message:
          "Location is required for offline interview",
      });
    }

    application.interview = {
      scheduledAt: interviewDate,
      mode,
      meetingLink:
        mode === "online" ? meetingLink.trim() : undefined,
      location:
        mode === "offline" ? location.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
    };

    application.status = "interview_scheduled";

    await application.save();

    // Find student
    const student = await Student.findById(
      application.studentId
    );

    // Notify student
    if (student && student.userId) {
      await createNotification({
        recipient: student.userId,
        title: "Interview Scheduled",
        message: `Your interview has been scheduled for ${interviewDate.toLocaleString()}.`,
        type: "interview",
        relatedId: application._id,
      });
    }

    // Audit log
    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "INTERVIEW_SCHEDULED",
      entityType: "Application",
      entityId: application._id,
      description: "Company scheduled an interview for the student.",
      metadata: {
        scheduledAt: interviewDate,
        mode,
        applicationId: application._id,
        studentId: application.studentId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Schedule interview error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET INTERVIEW DETAILS
// Student or Company can access
// ==========================================
const getInterview = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    )
      .populate("internshipId", "title")
      .populate("companyId", "companyName")
      .populate(
        "studentId",
        "studentId department year cgpa userId"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ==============================
    // STUDENT ACCESS
    // ==============================
    if (req.user.role === "student") {
      const student = await Student.findOne({
        userId: req.user._id,
      });

      if (
        !student ||
        !application.studentId ||
        application.studentId._id.toString() !==
          student._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    // ==============================
    // COMPANY ACCESS
    // ==============================
    if (req.user.role === "company") {
      const company = await Company.findOne({
        userId: req.user._id,
      });

      if (
        !company ||
        !application.companyId ||
        application.companyId._id.toString() !==
          company._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    return res.status(200).json({
      success: true,
      interview: application.interview,
      status: application.status,
      applicationId: application._id,
      internship: application.internshipId,
      company: application.companyId,
      student: application.studentId,
    });
  } catch (error) {
    console.error(
      "Get interview error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// SELECT STUDENT
// ==========================================
const selectApplication = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Company ownership check
    if (
      application.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this application",
      });
    }

    // Only interviewed candidates can be selected
    if (application.status !== "interview_scheduled") {
      return res.status(400).json({
        success: false,
        message:
          "Only candidates with a scheduled interview can be selected",
      });
    }

    const {
      joiningDate,
      offerLetterUrl,
    } = req.body;

    // Validate joining date
    if (!joiningDate) {
      return res.status(400).json({
        success: false,
        message: "Joining date is required",
      });
    }

    const joiningDateValue = new Date(joiningDate);

    if (Number.isNaN(joiningDateValue.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid joining date",
      });
    }

    if (joiningDateValue < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Joining date cannot be in the past",
      });
    }

    application.status = "selected";

    application.selection = {
      selectedAt: new Date(),
      joiningDate: joiningDateValue,
      offerLetterUrl: offerLetterUrl
        ? offerLetterUrl.trim()
        : undefined,
    };

    await application.save();

    // Find student
    const student = await Student.findById(
      application.studentId
    );

    // Notify student
    if (student && student.userId) {
      await createNotification({
        recipient: student.userId,
        title: "Internship Selected",
        message:
          "Congratulations! You have been selected for the internship.",
        type: "selection",
        relatedId: application._id,
      });
    }

    // Audit log
    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "STUDENT_SELECTED",
      entityType: "Application",
      entityId: application._id,
      description:
        "Company selected the student for the internship.",
      metadata: {
        studentId: application.studentId,
        internshipId: application.internshipId,
        joiningDate: joiningDateValue,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student selected successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Select application error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// PLACEMENT CELL - GET ALL APPLICATIONS
// ==========================================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate({
        path: "internshipId",
        select:
          "title companyId location workMode status",
        populate: {
          path: "companyId",
          select: "companyName",
        },
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get all applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch applications",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  applyForInternship,
  getMyApplications,
  getMyApplicationById,

  getInternshipApplicants,
  updateApplicationStatus,
  scheduleInterview,
  getInterview,
  selectApplication,
  getAllApplications,
};