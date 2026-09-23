const Evaluation = require("../models/Evaluation");
const Company = require("../models/Company");
const Student = require("../models/Student");
const Internship = require("../models/Internship");
const Application = require("../models/Application");

const { createAuditLog } = require(
  "../services/auditLogService"
);

const { createNotification } = require(
  "../services/notificationService"
);

// ==========================================
// COMPANY - CREATE EVALUATION
// ==========================================

const createEvaluation = async (req, res) => {
  try {
    const {
      internshipId,
      studentId,
      technicalSkills,
      communication,
      teamwork,
      problemSolving,
      professionalism,
      comments,
      recommendation,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !internshipId ||
      !studentId ||
      technicalSkills === undefined ||
      communication === undefined ||
      teamwork === undefined ||
      problemSolving === undefined ||
      professionalism === undefined ||
      !recommendation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required evaluation fields must be provided",
      });
    }

    // ==========================================
    // VALIDATE RECOMMENDATION
    // ==========================================

    const allowedRecommendations = [
      "highly_recommended",
      "recommended",
      "not_recommended",
    ];

    if (
      !allowedRecommendations.includes(
        recommendation
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation",
      });
    }

    // ==========================================
    // FIND COMPANY
    // ==========================================

    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // ==========================================
    // CHECK INTERNSHIP OWNERSHIP
    // ==========================================

    const internship = await Internship.findOne({
      _id: internshipId,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message:
          "Internship not found or not owned by company",
      });
    }

    // ==========================================
    // CHECK SELECTED STUDENT
    // ==========================================

    const application = await Application.findOne({
      internshipId,
      studentId,
      companyId: company._id,
      status: "selected",
    });

    if (!application) {
      return res.status(400).json({
        success: false,
        message:
          "Student is not selected for this internship",
      });
    }

    // ==========================================
    // CHECK DUPLICATE EVALUATION
    // ==========================================

    const existingEvaluation =
      await Evaluation.findOne({
        internshipId,
        studentId,
      });

    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        message:
          "Evaluation already exists for this student",
      });
    }

    // ==========================================
    // CONVERT RATINGS TO NUMBERS
    // ==========================================

    const ratings = [
      Number(technicalSkills),
      Number(communication),
      Number(teamwork),
      Number(problemSolving),
      Number(professionalism),
    ];

    // Check for invalid numbers
    const invalidNumber = ratings.some(
      (rating) => Number.isNaN(rating)
    );

    if (invalidNumber) {
      return res.status(400).json({
        success: false,
        message:
          "All ratings must be valid numbers",
      });
    }

    // Check rating range
    const invalidRating = ratings.some(
      (rating) => rating < 1 || rating > 5
    );

    if (invalidRating) {
      return res.status(400).json({
        success: false,
        message:
          "Ratings must be between 1 and 5",
      });
    }

    // ==========================================
    // CALCULATE OVERALL RATING
    // ==========================================

    const overallRating =
      ratings.reduce(
        (sum, rating) => sum + rating,
        0
      ) / ratings.length;

    // ==========================================
    // CREATE EVALUATION
    // ==========================================

    const evaluation = await Evaluation.create({
      internshipId,
      studentId,
      companyId: company._id,
      evaluatedBy: req.user._id,
      technicalSkills: ratings[0],
      communication: ratings[1],
      teamwork: ratings[2],
      problemSolving: ratings[3],
      professionalism: ratings[4],
      overallRating: Number(
        overallRating.toFixed(2)
      ),
      comments,
      recommendation,
    });

    // ==========================================
    // FIND STUDENT
    // ==========================================

    const student = await Student.findById(
      studentId
    );

    // ==========================================
    // NOTIFY STUDENT
    // ==========================================

    if (
      student &&
      student.userId
    ) {
      await createNotification({
        recipient: student.userId,
        title: "Internship Evaluation Submitted",
        message: `Your evaluation for "${internship.title}" has been submitted by the company.`,
        type: "system",
        relatedId: evaluation._id,
      });
    }

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "EVALUATION_CREATED",
      entityType: "Evaluation",
      entityId: evaluation._id,
      description:
        `Company submitted an evaluation for student ${studentId} for internship "${internship.title}"`,
      metadata: {
        internshipId,
        studentId,
        overallRating:
          evaluation.overallRating,
        recommendation,
      },
      ipAddress: req.ip,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message:
        "Evaluation submitted successfully",
      evaluation,
    });
  } catch (error) {
    console.error(
      "Create evaluation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit evaluation",
      error: error.message,
    });
  }
};

// ==========================================
// COMPANY - UPDATE EVALUATION
// ==========================================

const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND EVALUATION
    // ==========================================

    const evaluation =
      await Evaluation.findById(id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    // ==========================================
    // FIND COMPANY
    // ==========================================

    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // ==========================================
    // OWNERSHIP CHECK
    // ==========================================

    if (
      evaluation.companyId.toString() !==
      company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this evaluation",
      });
    }

    // ==========================================
    // GET UPDATE FIELDS
    // ==========================================

    const {
      technicalSkills,
      communication,
      teamwork,
      problemSolving,
      professionalism,
      comments,
      recommendation,
    } = req.body;

    const updatedFields = [];

    // ==========================================
    // UPDATE RATINGS
    // ==========================================

    if (technicalSkills !== undefined) {
      evaluation.technicalSkills =
        Number(technicalSkills);
      updatedFields.push(
        "technicalSkills"
      );
    }

    if (communication !== undefined) {
      evaluation.communication =
        Number(communication);
      updatedFields.push(
        "communication"
      );
    }

    if (teamwork !== undefined) {
      evaluation.teamwork =
        Number(teamwork);
      updatedFields.push("teamwork");
    }

    if (problemSolving !== undefined) {
      evaluation.problemSolving =
        Number(problemSolving);
      updatedFields.push(
        "problemSolving"
      );
    }

    if (professionalism !== undefined) {
      evaluation.professionalism =
        Number(professionalism);
      updatedFields.push(
        "professionalism"
      );
    }

    // ==========================================
    // UPDATE OTHER FIELDS
    // ==========================================

    if (comments !== undefined) {
      evaluation.comments = comments;
      updatedFields.push("comments");
    }

    if (recommendation !== undefined) {
      const allowedRecommendations = [
        "highly_recommended",
        "recommended",
        "not_recommended",
      ];

      if (
        !allowedRecommendations.includes(
          recommendation
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid recommendation",
        });
      }

      evaluation.recommendation =
        recommendation;

      updatedFields.push(
        "recommendation"
      );
    }

    // ==========================================
    // VALIDATE RATINGS
    // ==========================================

    const ratings = [
      Number(evaluation.technicalSkills),
      Number(evaluation.communication),
      Number(evaluation.teamwork),
      Number(evaluation.problemSolving),
      Number(evaluation.professionalism),
    ];

    const invalidNumber = ratings.some(
      (rating) => Number.isNaN(rating)
    );

    if (invalidNumber) {
      return res.status(400).json({
        success: false,
        message:
          "All ratings must be valid numbers",
      });
    }

    const invalidRating = ratings.some(
      (rating) => rating < 1 || rating > 5
    );

    if (invalidRating) {
      return res.status(400).json({
        success: false,
        message:
          "Ratings must be between 1 and 5",
      });
    }

    // ==========================================
    // RECALCULATE OVERALL RATING
    // ==========================================

    evaluation.overallRating = Number(
      (
        ratings.reduce(
          (sum, rating) => sum + rating,
          0
        ) / ratings.length
      ).toFixed(2)
    );

    await evaluation.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "EVALUATION_UPDATED",
      entityType: "Evaluation",
      entityId: evaluation._id,
      description:
        "Company updated an internship evaluation",
      metadata: {
        updatedFields,
        overallRating:
          evaluation.overallRating,
      },
      ipAddress: req.ip,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      message:
        "Evaluation updated successfully",
      evaluation,
    });
  } catch (error) {
    console.error(
      "Update evaluation error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update evaluation",
      error: error.message,
    });
  }
};

// ==========================================
// GET EVALUATIONS FOR INTERNSHIP
// COMPANY + PLACEMENT CELL
// ==========================================

const getInternshipEvaluations = async (
  req,
  res
) => {
  try {
    const { internshipId } = req.params;

    // ==========================================
    // FIND INTERNSHIP
    // ==========================================

    const internship =
      await Internship.findById(
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
          message:
            "Company profile not found",
        });
      }

      if (
        internship.companyId.toString() !==
        company._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view these evaluations",
        });
      }
    }

    // ==========================================
    // GET EVALUATIONS
    // ==========================================

    const evaluations =
      await Evaluation.find({
        internshipId,
      })
        .populate(
          "studentId",
          "studentId department year cgpa"
        )
        .populate(
          "companyId",
          "companyName industry"
        )
        .populate(
          "evaluatedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      count: evaluations.length,
      internship: {
        id: internship._id,
        title: internship.title,
        companyId: internship.companyId,
      },
      evaluations,
    });
  } catch (error) {
    console.error(
      "Get evaluations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch evaluations",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createEvaluation,
  updateEvaluation,
  getInternshipEvaluations,
};
