const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "under_review",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected",
      ],
      default: "applied",
    },

    interview: {
      scheduledAt: Date,
      mode: {
        type: String,
        enum: ["online", "offline"],
      },
      meetingLink: String,
      location: String,
      notes: String,
    },

    selection: {
      selectedAt: Date,
      joiningDate: Date,
      offerLetterUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from applying twice
applicationSchema.index(
  {
    studentId: 1,
    internshipId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);