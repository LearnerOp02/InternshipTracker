const mongoose = require("mongoose");

const weeklyReportSchema = new mongoose.Schema(
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

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    workDone: {
      type: String,
      required: true,
      trim: true,
    },

    skillsLearned: {
      type: [String],
      default: [],
    },

    challenges: {
      type: String,
      trim: true,
    },

    hoursWorked: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed"],
      default: "submitted",
    },

    reviewerComment: {
      type: String,
      trim: true,
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

weeklyReportSchema.index(
  { internshipId: 1, studentId: 1, weekNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("WeeklyReport", weeklyReportSchema);