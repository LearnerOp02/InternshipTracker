const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    year: {
      type: Number,
    },

    batch: {
      type: String,
      trim: true,
    },

    semester: {
      type: Number,
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    projects: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [String],
      default: [],
    },

    resume: {
      fileName: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);