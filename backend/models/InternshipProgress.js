const mongoose = require("mongoose");

const internshipProgressSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["not_started", "ongoing", "completed"],
      default: "not_started",
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    totalTasks: {
      type: Number,
      default: 0,
    },

    completedTasks: {
      type: Number,
      default: 0,
    },

    totalReports: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

internshipProgressSchema.index(
  { internshipId: 1, studentId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InternshipProgress",
  internshipProgressSchema
);