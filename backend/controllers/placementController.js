const Student = require("../models/Student");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Task = require("../models/Task");
const Document = require("../models/Document");


// ==========================================
// PLACEMENT CELL - REPORT SUMMARY
// ==========================================
const getPlacementReports = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      approvedCompanies,
      totalInternships,
      publishedInternships,
      ongoingInternships,
      completedInternships,
      totalApplications,
      selectedApplications,
      rejectedApplications,
      totalTasks,
      completedTasks,
      totalDocuments,
      verifiedDocuments,
    ] = await Promise.all([
      Student.countDocuments(),

      Company.countDocuments(),

      Company.countDocuments({
        verificationStatus: "approved",
      }),

      Internship.countDocuments(),

      Internship.countDocuments({
        status: "published",
      }),

      Internship.countDocuments({
        status: "ongoing",
      }),

      Internship.countDocuments({
        status: "completed",
      }),

      Application.countDocuments(),

      Application.countDocuments({
        status: "selected",
      }),

      Application.countDocuments({
        status: "rejected",
      }),

      Task.countDocuments(),

      Task.countDocuments({
        status: "completed",
      }),

      Document.countDocuments(),

      Document.countDocuments({
        status: "verified",
      }),
    ]);


    const selectionRate =
      totalApplications > 0
        ? Number(
            (
              (selectedApplications /
                totalApplications) *
              100
            ).toFixed(2)
          )
        : 0;


    const taskCompletionRate =
      totalTasks > 0
        ? Number(
            (
              (completedTasks /
                totalTasks) *
              100
            ).toFixed(2)
          )
        : 0;


    const documentVerificationRate =
      totalDocuments > 0
        ? Number(
            (
              (verifiedDocuments /
                totalDocuments) *
              100
            ).toFixed(2)
          )
        : 0;


    res.status(200).json({
      success: true,

      summary: {
        students: {
          total: totalStudents,
        },

        companies: {
          total: totalCompanies,
          approved: approvedCompanies,
        },

        internships: {
          total: totalInternships,
          published: publishedInternships,
          ongoing: ongoingInternships,
          completed: completedInternships,
        },

        applications: {
          total: totalApplications,
          selected: selectedApplications,
          rejected: rejectedApplications,
          selectionRate,
        },

        tasks: {
          total: totalTasks,
          completed: completedTasks,
          completionRate:
            taskCompletionRate,
        },

        documents: {
          total: totalDocuments,
          verified: verifiedDocuments,
          verificationRate:
            documentVerificationRate,
        },
      },
    });

  } catch (error) {
    console.error(
      "Placement reports error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate placement reports",
      error: error.message,
    });
  }
};


module.exports = {
  getPlacementReports,
};