const Student = require("../models/Student");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const InternshipProgress = require("../models/InternshipProgress");
const Document = require("../models/Document");


// ==========================================
// GET INTERNSHIP REPORT
// ==========================================
const getInternshipReport = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate(
        "companyId",
        "companyName industry location"
      )
      .sort({ createdAt: -1 });

    const report = {
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

    res.status(200).json({
      success: true,
      report,
      internships,
    });
  } catch (error) {
    console.error(
      "Internship report error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET STUDENT REPORT
// ==========================================
const getStudentReport = async (req, res) => {
  try {
    const [
      totalStudents,
      studentsWithApplications,
      selectedStudents,
      ongoingStudents,
      completedStudents,
    ] = await Promise.all([
      // Total students
      Student.countDocuments(),

      // Students who have applied
      Application.distinct("studentId"),

      // Selected students
      Application.distinct("studentId", {
        status: "selected",
      }),

      // Ongoing internships
      InternshipProgress.distinct("studentId", {
        status: "ongoing",
      }),

      // Completed internships
      InternshipProgress.distinct("studentId", {
        status: "completed",
      }),
    ]);

    res.status(200).json({
      success: true,

      report: {
        totalStudents,

        studentsWithApplications:
          studentsWithApplications.length,

        studentsWithoutApplications:
          Math.max(
            totalStudents -
              studentsWithApplications.length,
            0
          ),

        selectedStudents:
          selectedStudents.length,

        ongoingStudents:
          ongoingStudents.length,

        completedStudents:
          completedStudents.length,
      },
    });
  } catch (error) {
    console.error(
      "Student report error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET COMPANY REPORT
// ==========================================
const getCompanyReport = async (req, res) => {
  try {
    const [
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      rejectedCompanies,
      internships,
      applications,
    ] = await Promise.all([
      Company.countDocuments(),

      Company.countDocuments({
        verificationStatus: "pending",
      }),

      Company.countDocuments({
        verificationStatus: "approved",
      }),

      Company.countDocuments({
        verificationStatus: "rejected",
      }),

      Internship.find()
        .populate(
          "companyId",
          "companyName industry"
        ),

      Application.find()
        .populate(
          "companyId",
          "companyName"
        ),
    ]);

    // ==========================================
    // COMPANY-WISE INTERNSHIP COUNT
    // ==========================================

    const companyStats = {};

    for (const internship of internships) {
      const company =
        internship.companyId?.companyName ||
        "Unknown";

      if (!companyStats[company]) {
        companyStats[company] = {
          internships: 0,
          applications: 0,
          selected: 0,
        };
      }

      companyStats[company].internships++;
    }

    // ==========================================
    // COMPANY-WISE APPLICATION COUNT
    // ==========================================

    for (const application of applications) {
      const company =
        application.companyId?.companyName ||
        "Unknown";

      if (!companyStats[company]) {
        companyStats[company] = {
          internships: 0,
          applications: 0,
          selected: 0,
        };
      }

      companyStats[company].applications++;

      if (application.status === "selected") {
        companyStats[company].selected++;
      }
    }

    res.status(200).json({
      success: true,

      report: {
        companies: {
          total: totalCompanies,
          pending: pendingCompanies,
          approved: approvedCompanies,
          rejected: rejectedCompanies,
        },

        companyStats,
      },
    });
  } catch (error) {
    console.error(
      "Company report error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET APPLICATION REPORT
// ==========================================
const getApplicationReport = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(
        "studentId",
        "studentId department year"
      )
      .populate(
        "internshipId",
        "title"
      )
      .populate(
        "companyId",
        "companyName"
      )
      .sort({ appliedAt: -1 });

    const report = {
      total: applications.length,

      applied: applications.filter(
        (item) => item.status === "applied"
      ).length,

      underReview: applications.filter(
        (item) => item.status === "under_review"
      ).length,

      shortlisted: applications.filter(
        (item) => item.status === "shortlisted"
      ).length,

      interviewScheduled: applications.filter(
        (item) =>
          item.status === "interview_scheduled"
      ).length,

      selected: applications.filter(
        (item) => item.status === "selected"
      ).length,

      rejected: applications.filter(
        (item) => item.status === "rejected"
      ).length,
    };

    res.status(200).json({
      success: true,
      report,
      applications,
    });
  } catch (error) {
    console.error(
      "Application report error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET DEPARTMENT REPORT
// ==========================================
const getDepartmentReport = async (req, res) => {
  try {
    const [
      students,
      applications,
      progressRecords,
    ] = await Promise.all([
      Student.find(
        {},
        "studentId department year"
      ),

      Application.find()
        .populate(
          "studentId",
          "department"
        ),

      InternshipProgress.find()
        .populate(
          "studentId",
          "department"
        ),
    ]);

    const departmentStats = {};

    // ==========================================
    // STUDENTS
    // ==========================================

    for (const student of students) {
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

    // ==========================================
    // APPLICATIONS
    // ==========================================

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

    // ==========================================
    // INTERNSHIP PROGRESS
    // ==========================================

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
      departments: departmentStats,
    });
  } catch (error) {
    console.error(
      "Department report error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET DOCUMENT REPORT
// ==========================================
const getDocumentReport = async (req, res) => {
  try {
    const [
      total,
      pending,
      verified,
      rejected,
    ] = await Promise.all([
      Document.countDocuments(),

      Document.countDocuments({
        verificationStatus: "pending",
      }),

      Document.countDocuments({
        verificationStatus: "verified",
      }),

      Document.countDocuments({
        verificationStatus: "rejected",
      }),
    ]);

    res.status(200).json({
      success: true,

      report: {
        total,
        pending,
        verified,
        rejected,
      },
    });
  } catch (error) {
    console.error(
      "Document report error:",
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
  getInternshipReport,
  getStudentReport,
  getCompanyReport,
  getApplicationReport,
  getDepartmentReport,
  getDocumentReport,
};
