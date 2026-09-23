const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    technicalSkills: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    teamwork: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    problemSolving: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    overallRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comments: {
      type: String,
      trim: true,
    },

    recommendation: {
      type: String,
      enum: [
        "highly_recommended",
        "recommended",
        "not_recommended",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed"],
      default: "submitted",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

evaluationSchema.index(
  { internshipId: 1, studentId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Evaluation",
  evaluationSchema
);