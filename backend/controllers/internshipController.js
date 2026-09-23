const Internship = require("../models/Internship");
const Company = require("../models/Company");
const Student = require("../models/Student");
const checkEligibility = require("../services/eligibilityService");
const Application = require("../models/Application");
const Task = require("../models/Task");

// ==========================================
// CREATE INTERNSHIP
// Company must be approved
// ==========================================
const createInternship = async (req, res) => {
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

    if (company.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Company is not approved by Placement Cell",
      });
    }

    const {
      title,
      description,
      requiredSkills,
      eligibility,
      duration,
      stipend,
      location,
      workMode,
      openings,
      applicationDeadline,
      startDate,
      endDate,
    } = req.body;

    if (!title || !openings || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message:
          "Title, openings and application deadline are required",
      });
    }

    const internship = await Internship.create({
      companyId: company._id,
      title,
      description,
      requiredSkills,
      eligibility,
      duration,
      stipend,
      location,
      workMode,
      openings,
      applicationDeadline,
      startDate,
      endDate,
      status: "draft",
    });

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    console.error("Create internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET MY INTERNSHIPS
// Company sees its own internships
// ==========================================
const getMyInternships = async (req, res) => {
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

    const internships = await Internship.find({
      companyId: company._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error("Get my internships error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET SINGLE INTERNSHIP - COMPANY
// ==========================================
const getMyInternshipById = async (req, res) => {
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
      _id: req.params.id,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    console.error("Get internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE INTERNSHIP
// Only draft internships can be updated
// ==========================================
const updateInternship = async (req, res) => {
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
      _id: req.params.id,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft internships can be updated",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "requiredSkills",
      "eligibility",
      "duration",
      "stipend",
      "location",
      "workMode",
      "openings",
      "applicationDeadline",
      "startDate",
      "endDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        internship[field] = req.body[field];
      }
    });

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      internship,
    });
  } catch (error) {
    console.error("Update internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// SUBMIT INTERNSHIP FOR APPROVAL
// Draft → Pending Approval
// ==========================================
const submitInternship = async (req, res) => {
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
      _id: req.params.id,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft internships can be submitted",
      });
    }

    internship.status = "pending_approval";

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Internship submitted for Placement Cell approval",
      internship,
    });
  } catch (error) {
    console.error("Submit internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET PENDING INTERNSHIPS
// Placement Cell only
// ==========================================
const getPendingInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      status: "pending_approval",
    })
      .populate("companyId", "companyName industry location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error("Get pending internships error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// APPROVE INTERNSHIP
// Pending Approval → Approved
// ==========================================
const approveInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "pending_approval") {
      return res.status(400).json({
        success: false,
        message:
          "Only internships pending approval can be approved",
      });
    }

    internship.status = "approved";
    internship.approvedBy = req.user._id;
    internship.approvedAt = new Date();
    internship.rejectionReason = undefined;

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Internship approved successfully",
      internship,
    });
  } catch (error) {
    console.error("Approve internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// REJECT INTERNSHIP
// Pending Approval → Rejected
// ==========================================
const rejectInternship = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "pending_approval") {
      return res.status(400).json({
        success: false,
        message:
          "Only internships pending approval can be rejected",
      });
    }

    internship.status = "draft";
    internship.rejectionReason = rejectionReason;

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Internship rejected and returned to draft",
      internship,
    });
  } catch (error) {
    console.error("Reject internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// PUBLISH INTERNSHIP
// Approved → Published
// ==========================================
const publishInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.status !== "approved") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved internships can be published",
      });
    }

    internship.status = "published";
    internship.publishedAt = new Date();

    await internship.save();

    res.status(200).json({
      success: true,
      message: "Internship published successfully",
      internship,
    });
  } catch (error) {
    console.error("Publish internship error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET PUBLISHED INTERNSHIPS
// Students can browse published internships
// ==========================================
const getPublishedInternships = async (req, res) => {
  try {
    const {
      search,
      location,
      workMode,
      branch,
    } = req.query;

    const filter = {
      status: "published",
      applicationDeadline: {
        $gte: new Date(),
      },
    };

    // Search by internship title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by work mode
    if (workMode) {
      filter.workMode = workMode;
    }

    // Filter by eligible branch
    if (branch) {
      filter["eligibility.branches"] = {
        $in: [branch],
      };
    }

    const internships = await Internship.find(filter)
      .populate(
        "companyId",
        "companyName industry location website"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error(
      "Get published internships error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET SINGLE PUBLISHED INTERNSHIP
// Student views internship details
// ==========================================
const getPublishedInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      status: "published",
    }).populate(
      "companyId",
      "companyName industry description website location"
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    console.error(
      "Get published internship error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// CHECK STUDENT ELIGIBILITY
// ==========================================
const getInternshipEligibility = async (req, res) => {
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

    const internship = await Internship.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Published internship not found",
      });
    }

    const result = checkEligibility(
      student,
      internship
    );

    res.status(200).json({
      success: true,
      internshipId: internship._id,
      eligible: result.eligible,
      reasons: result.reasons,
      missingSkills: result.missingSkills,
    });
  } catch (error) {
    console.error(
      "Eligibility check error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET APPROVED INTERNSHIPS
// Placement Cell only
// ==========================================
const getApprovedInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      status: "approved",
    })
      .populate(
        "companyId",
        "companyName industry location website"
      )
      .sort({
        approvedAt: -1,
      });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error(
      "Get approved internships error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch approved internships",
    });
  }
};


// ==========================================
// PLACEMENT CELL - INTERNSHIP MONITORING
// ==========================================
const getInternshipMonitoring = async (req, res) => {
  try {
    const internships = await Internship.find({
      status: {
        $in: [
          "published",
          "application_closed",
          "ongoing",
          "completed",
        ],
      },
    })
      .populate(
        "companyId",
        "companyName industry location"
      )
      .sort({
        createdAt: -1,
      });

    const monitoringData = await Promise.all(
      internships.map(async (internship) => {
        const selectedApplications =
          await Application.find({
            internshipId: internship._id,
            status: "selected",
          })
            .populate({
              path: "studentId",
              populate: {
                path: "userId",
                select: "name email",
              },
            });

        const tasks = await Task.find({
          internshipId: internship._id,
        });

        const totalTasks = tasks.length;

        const completedTasks =
          tasks.filter(
            (task) =>
              task.status === "completed"
          ).length;

        const progress =
          totalTasks > 0
            ? Math.round(
                (completedTasks /
                  totalTasks) *
                  100
              )
            : 0;

        return {
          internship,
          selectedStudents:
            selectedApplications.map(
              (application) =>
                application.studentId
            ),
          selectedCount:
            selectedApplications.length,
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: monitoringData.length,
      internships: monitoringData,
    });
  } catch (error) {
    console.error(
      "Internship monitoring error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch internship monitoring data",
      error: error.message,
    });
  }
};

module.exports = {
  createInternship,
  getMyInternships,
  getMyInternshipById,
  updateInternship,
  submitInternship,

  getPendingInternships,
  getApprovedInternships,
  approveInternship,
  rejectInternship,
  publishInternship,

  getPublishedInternships,
  getPublishedInternshipById,

  getInternshipEligibility,
  getInternshipMonitoring,
};