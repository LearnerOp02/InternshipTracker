const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ internshipId: 1 });
taskSchema.index({ studentId: 1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model("Task", taskSchema);