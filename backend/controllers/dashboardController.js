const User = require("../models/User");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Document = require("../models/Document");
const Task = require("../models/Task");
const WeeklyReport = require("../models/WeeklyReport");
const InternshipProgress = require("../models/InternshipProgress");
const Evaluation = require("../models/Evaluation");
const Notification = require("../models/Notification");

// ==========================================
// STUDENT DASHBOARD
// ==========================================
const getStudentDashboard = async (req, res) => {
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

    // Run queries in parallel
    const [
      applications,
      selectedApplications,
      activeApplications,
      tasks,
      reportsCount,
      documents,
      progressRecords,
      unreadNotifications,
      recentNotifications,
    ] = await Promise.all([
      // All applications
      Application.find({
        studentId: student._id,
      })
        .populate(
          "internshipId",
          "title duration stipend location workMode status"
        )
        .populate(
          "companyId",
          "companyName industry"
        )
        .sort({ appliedAt: -1 }),

      // Selected internships
      Application.find({
        studentId: student._id,
        status: "selected",
      })
        .populate(
          "internshipId",
          "title duration stipend location workMode startDate endDate status"
        )
        .populate(
          "companyId",
          "companyName industry"
        )
        .sort({ createdAt: -1 }),

      // Active internship applications
      Application.find({
        studentId: student._id,
        status: "selected",
      })
        .populate(
          "internshipId",
          "title startDate endDate status"
        ),

      // Tasks
      Task.find({
        studentId: student._id,
      }).sort({ dueDate: 1 }),

      // Weekly reports
      WeeklyReport.countDocuments({
        studentId: student._id,
      }),

      // Documents
      Document.find({
        studentId: student._id,
      }).sort({ createdAt: -1 }),

      // Progress
      InternshipProgress.find({
        studentId: student._id,
      }).populate(
        "internshipId",
        "title startDate endDate status"
      ),

      // Unread notifications
      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),

      // Recent notifications
      Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // ==========================================
    // APPLICATION STATISTICS
    // ==========================================

    const applicationStats = {
      total: applications.length,
      applied: applications.filter(
        (app) => app.status === "applied"
      ).length,
      underReview: applications.filter(
        (app) => app.status === "under_review"
      ).length,
      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,
      interviewScheduled: applications.filter(
        (app) => app.status === "interview_scheduled"
      ).length,
      selected: applications.filter(
        (app) => app.status === "selected"
      ).length,
      rejected: applications.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    // ==========================================
    // TASK STATISTICS
    // ==========================================

    const taskStats = {
      total: tasks.length,
      pending: tasks.filter(
        (task) => task.status === "pending"
      ).length,
      inProgress: tasks.filter(
        (task) => task.status === "in_progress"
      ).length,
      completed: tasks.filter(
        (task) => task.status === "completed"
      ).length,
    };

    // ==========================================
    // DOCUMENT STATISTICS
    // ==========================================

    const documentStats = {
      total: documents.length,
      pending: documents.filter(
        (doc) => doc.verificationStatus === "pending"
      ).length,
      verified: documents.filter(
        (doc) => doc.verificationStatus === "verified"
      ).length,
      rejected: documents.filter(
        (doc) => doc.verificationStatus === "rejected"
      ).length,
    };

    // ==========================================
    // ACTIVE INTERNSHIP
    // ==========================================

    const activeInternship =
      progressRecords.find(
        (progress) =>
          progress.status === "ongoing"
      ) || null;

    res.status(200).json({
      success: true,

      dashboard: {
        profile: {
          studentId: student.studentId,
          department: student.department,
          year: student.year,
          batch: student.batch,
          semester: student.semester,
          cgpa: student.cgpa,
          backlogs: student.backlogs,
          skills: student.skills,
          resume: student.resume,
        },

        applications: {
          statistics: applicationStats,
          recent: applications.slice(0, 5),
        },

        selectedInternships: selectedApplications,

        activeInternship,

        tasks: {
          statistics: taskStats,
          recent: tasks.slice(0, 5),
        },

        weeklyReports: {
          total: reportsCount,
        },

        documents: {
          statistics: documentStats,
          recent: documents.slice(0, 5),
        },

        progress: progressRecords,

        notifications: {
          unreadCount: unreadNotifications,
          recent: recentNotifications,
        },
      },
    });
  } catch (error) {
    console.error(
      "Student dashboard error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// COMPANY DASHBOARD
// ==========================================
const getCompanyDashboard = async (req, res) => {
  try {
    // Find company profile
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Find company's internships first
    const internships = await Internship.find({
      companyId: company._id,
    }).sort({ createdAt: -1 });

    const internshipIds = internships.map(
      (internship) => internship._id
    );

    // Run queries in parallel
    const [
      applications,
      selectedApplications,
      tasks,
      evaluations,
      pendingDocuments,
      unreadNotifications,
      recentNotifications,
    ] = await Promise.all([
      // Applications for company's internships
      Application.find({
        companyId: company._id,
      })
        .populate(
          "internshipId",
          "title status"
        )
        .populate(
          "studentId",
          "studentId department year cgpa skills"
        )
        .sort({ appliedAt: -1 }),

      // Selected students
      Application.find({
        companyId: company._id,
        status: "selected",
      })
        .populate(
          "internshipId",
          "title startDate endDate status"
        )
        .populate(
          "studentId",
          "studentId department year cgpa"
        ),

      // Tasks
      Task.find({
        internshipId: {
          $in: internshipIds,
        },
      }).sort({ createdAt: -1 }),

      // Evaluations
      Evaluation.find({
        companyId: company._id,
      })
        .populate(
          "studentId",
          "studentId department year"
        )
        .populate(
          "internshipId",
          "title"
        )
        .sort({ createdAt: -1 }),

      // Pending documents related to company's internships
      Document.find({
        internshipId: {
          $in: internshipIds,
        },
        verificationStatus: "pending",
      })
        .populate(
          "studentId",
          "studentId department year"
        )
        .populate(
          "internshipId",
          "title"
        ),

      // Unread notifications
      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),

      // Recent notifications
      Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // ==========================================
    // INTERNSHIP STATISTICS
    // ==========================================

    const internshipStats = {
      total: internships.length,

      draft: internships.filter(
        (item) => item.status === "draft"
      ).length,

      pendingApproval: internships.filter(
        (item) =>
          item.status === "pending_approval"
      ).length,

      approved: internships.filter(
        (item) => item.status === "approved"
      ).length,

      published: internships.filter(
        (item) => item.status === "published"
      ).length,

      applicationClosed: internships.filter(
        (item) =>
          item.status === "application_closed"
      ).length,

      ongoing: internships.filter(
        (item) => item.status === "ongoing"
      ).length,

      completed: internships.filter(
        (item) => item.status === "completed"
      ).length,
    };

    // ==========================================
    // APPLICATION STATISTICS
    // ==========================================

    const applicationStats = {
      total: applications.length,

      applied: applications.filter(
        (app) => app.status === "applied"
      ).length,

      underReview: applications.filter(
        (app) => app.status === "under_review"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,

      interviewScheduled: applications.filter(
        (app) =>
          app.status === "interview_scheduled"
      ).length,

      selected: applications.filter(
        (app) => app.status === "selected"
      ).length,

      rejected: applications.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    // ==========================================
    // TASK STATISTICS
    // ==========================================

    const taskStats = {
      total: tasks.length,

      pending: tasks.filter(
        (task) => task.status === "pending"
      ).length,

      inProgress: tasks.filter(
        (task) => task.status === "in_progress"
      ).length,

      completed: tasks.filter(
        (task) => task.status === "completed"
      ).length,
    };

    res.status(200).json({
      success: true,

      dashboard: {
        company: {
          companyName: company.companyName,
          industry: company.industry,
          location: company.location,
          website: company.website,
          verificationStatus:
            company.verificationStatus,
        },

        internships: {
          statistics: internshipStats,
          recent: internships.slice(0, 5),
        },

        applications: {
          statistics: applicationStats,
          recent: applications.slice(0, 5),
        },

        selectedStudents: selectedApplications,

        tasks: {
          statistics: taskStats,
          recent: tasks.slice(0, 5),
        },

        evaluations: {
          total: evaluations.length,
          recent: evaluations.slice(0, 5),
        },

        pendingDocuments: {
          total: pendingDocuments.length,
          documents: pendingDocuments.slice(0, 5),
        },

        notifications: {
          unreadCount: unreadNotifications,
          recent: recentNotifications,
        },
      },
    });
  } catch (error) {
    console.error(
      "Company dashboard error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// PLACEMENT CELL DASHBOARD
// ==========================================
const getPlacementDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      pendingCompanies,
      internships,
      applications,
      pendingDocuments,
      progressRecords,
      recentApplications,
      recentInternships,
    ] = await Promise.all([
      // Students
      Student.countDocuments(),

      // Companies
      Company.countDocuments(),

      // Pending company verification
      Company.countDocuments({
        verificationStatus: "pending",
      }),

      // All internships
      Internship.find()
        .populate(
          "companyId",
          "companyName industry"
        )
        .sort({ createdAt: -1 }),

      // All applications
      Application.find()
        .populate(
          "studentId",
          "studentId department year"
        )
        .populate(
          "internshipId",
          "title status"
        )
        .populate(
          "companyId",
          "companyName"
        )
        .sort({ appliedAt: -1 }),

      // Pending documents
      Document.find({
        verificationStatus: "pending",
      })
        .populate(
          "studentId",
          "studentId department year"
        )
        .populate(
          "internshipId",
          "title"
        )
        .sort({ createdAt: -1 }),

      // Internship progress
      InternshipProgress.find()
        .populate(
          "studentId",
          "studentId department year"
        )
        .populate(
          "internshipId",
          "title status"
        ),

      // Recent applications
      Application.find()
        .populate(
          "studentId",
          "studentId"
        )
        .populate(
          "internshipId",
          "title"
        )
        .populate(
          "companyId",
          "companyName"
        )
        .sort({ appliedAt: -1 })
        .limit(10),

      // Recent internships
      Internship.find()
        .populate(
          "companyId",
          "companyName"
        )
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // ==========================================
    // INTERNSHIP STATISTICS
    // ==========================================

    const internshipStats = {
      total: internships.length,

      draft: internships.filter(
        (item) => item.status === "draft"
      ).length,

      pendingApproval: internships.filter(
        (item) =>
          item.status === "pending_approval"
      ).length,

      approved: internships.filter(
        (item) => item.status === "approved"
      ).length,

      published: internships.filter(
        (item) => item.status === "published"
      ).length,

      applicationClosed: internships.filter(
        (item) =>
          item.status === "application_closed"
      ).length,

      ongoing: internships.filter(
        (item) => item.status === "ongoing"
      ).length,

      completed: internships.filter(
        (item) => item.status === "completed"
      ).length,

      archived: internships.filter(
        (item) => item.status === "archived"
      ).length,
    };

    // ==========================================
    // APPLICATION STATISTICS
    // ==========================================

    const applicationStats = {
      total: applications.length,

      applied: applications.filter(
        (app) => app.status === "applied"
      ).length,

      underReview: applications.filter(
        (app) => app.status === "under_review"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,

      interviewScheduled: applications.filter(
        (app) =>
          app.status === "interview_scheduled"
      ).length,

      selected: applications.filter(
        (app) => app.status === "selected"
      ).length,

      rejected: applications.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    // ==========================================
    // PROGRESS STATISTICS
    // ==========================================

    const progressStats = {
      total: progressRecords.length,

      notStarted: progressRecords.filter(
        (item) => item.status === "not_started"
      ).length,

      ongoing: progressRecords.filter(
        (item) => item.status === "ongoing"
      ).length,

      completed: progressRecords.filter(
        (item) => item.status === "completed"
      ).length,
    };

    // ==========================================
    // DEPARTMENT-WISE STATISTICS
    // ==========================================

    const departmentStats = {};

    for (const student of await Student.find(
      {},
      "department"
    )) {
      const department =
        student.department || "Unknown";

      if (!departmentStats[department]) {
        departmentStats[department] = {
          students: 0,
          applications: 0,
          selected: 0,
          ongoing: 0,
          completed: 0,
        };
      }

      departmentStats[department].students++;
    }

    // Count applications by department
    for (const application of applications) {
      const department =
        application.studentId?.department ||
        "Unknown";

      if (!departmentStats[department]) {
        departmentStats[department] = {
          students: 0,
          applications: 0,
          selected: 0,
          ongoing: 0,
          completed: 0,
        };
      }

      departmentStats[department].applications++;

      if (application.status === "selected") {
        departmentStats[department].selected++;
      }
    }

    // Count ongoing/completed internships by department
    for (const progress of progressRecords) {
      const department =
        progress.studentId?.department ||
        "Unknown";

      if (!departmentStats[department]) {
        departmentStats[department] = {
          students: 0,
          applications: 0,
          selected: 0,
          ongoing: 0,
          completed: 0,
        };
      }

      if (progress.status === "ongoing") {
        departmentStats[department].ongoing++;
      }

      if (progress.status === "completed") {
        departmentStats[department].completed++;
      }
    }

    res.status(200).json({
      success: true,

      dashboard: {
        overview: {
          totalStudents,
          totalCompanies,
          pendingCompanyVerification:
            pendingCompanies,

          totalInternships:
            internshipStats.total,

          pendingInternshipApproval:
            internshipStats.pendingApproval,

          totalApplications:
            applicationStats.total,

          selectedStudents:
            applicationStats.selected,

          ongoingInternships:
            progressStats.ongoing,

          completedInternships:
            progressStats.completed,

          pendingDocuments:
            pendingDocuments.length,
        },

        internships: {
          statistics: internshipStats,
          recent: recentInternships,
        },

        applications: {
          statistics: applicationStats,
          recent: recentApplications,
        },

        progress: {
          statistics: progressStats,
          records: progressRecords.slice(0, 10),
        },

        documents: {
          pendingCount:
            pendingDocuments.length,
          recent: pendingDocuments.slice(0, 10),
        },

        departments: departmentStats,
      },
    });
  } catch (error) {
    console.error(
      "Placement dashboard error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getStudentDashboard,
  getCompanyDashboard,
  getPlacementDashboard,
};
