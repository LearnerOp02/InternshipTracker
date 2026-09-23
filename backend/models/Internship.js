const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    eligibility: {
      branches: {
        type: [String],
        default: [],
      },

      minimumCGPA: {
        type: Number,
        min: 0,
        max: 10,
      },

      maximumBacklogs: {
        type: Number,
        min: 0,
        default: 0,
      },

      eligibleYears: {
        type: [Number],
        default: [],
      },
    },

    duration: {
      type: String,
      trim: true,
    },

    stipend: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["onsite", "hybrid", "remote"],
      default: "onsite",
    },

    openings: {
      type: Number,
      required: true,
      min: 1,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "pending_approval",
        "approved",
        "published",
        "application_closed",
        "ongoing",
        "completed",
        "archived",
      ],
      default: "draft",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Internship", internshipSchema);