const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },

    type: {
      type: String,
      enum: [
        "resume",
        "offer_letter",
        "joining_letter",
        "certificate",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ studentId: 1 });
documentSchema.index({ internshipId: 1 });
documentSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model("Document", documentSchema);