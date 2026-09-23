const Task = require("../models/Task");
const Student = require("../models/Student");
const Internship = require("../models/Internship");
const Company = require("../models/Company");
const Application = require("../models/Application");

const { calculateProgress } = require("../services/progressService");
const { createNotification } = require("../services/notificationService");

// ==========================================
// COMPANY - CREATE TASK
// ==========================================

const createTask = async (req, res) => {
  try {
    const {
      internshipId,
      studentId,
      title,
      description,
      dueDate,
    } = req.body;

    if (!internshipId || !studentId || !title) {
      return res.status(400).json({
        message: "Internship ID, student ID and title are required",
      });
    }

    // Find company profile
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    // Check internship belongs to company
    const internship = await Internship.findOne({
      _id: internshipId,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found or not owned by company",
      });
    }

    // Check student is selected
    const application = await Application.findOne({
      internshipId,
      studentId,
      status: "selected",
    });

    if (!application) {
      return res.status(400).json({
        message: "Student is not selected for this internship",
      });
    }

    // Create task
    const task = await Task.create({
      internshipId,
      studentId,
      assignedBy: req.user._id,
      title,
      description,
      dueDate,
    });

    // Notify student
    const student = await Student.findById(studentId);

    if (student) {
      await createNotification({
        recipient: student.userId,
        title: "New Task Assigned",
        message: `A new task has been assigned to you: ${title}`,
        type: "task",
        relatedId: task._id,
      });
    }

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// ==========================================
// GET TASKS FOR INTERNSHIP
// COMPANY + PLACEMENT CELL
// ==========================================

const getInternshipTasks = async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Find internship first
    const internship = await Internship.findById(internshipId);

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
          message: "Company profile not found",
        });
      }

      // Make sure internship belongs to this company
      if (
        internship.companyId.toString() !==
        company._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these tasks",
        });
      }
    }

    // ==========================================
    // GET TASKS
    // ==========================================

    const tasks = await Task.find({
      internshipId,
    })
      .populate(
        "studentId",
        "studentId department year"
      )
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TASK
// COMPANY
// ==========================================

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check company ownership
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const internship = await Internship.findOne({
      _id: task.internshipId,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(403).json({
        message: "You are not authorized to update this task",
      });
    }

    const {
      title,
      description,
      dueDate,
    } = req.body;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE TASK STATUS
// STUDENT
// ==========================================

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // Find student profile
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Make sure task belongs to this student
    const task = await Task.findOne({
      _id: id,
      studentId: student._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = status;

    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }

    await task.save();

    // Recalculate internship progress
    const progress = await calculateProgress(
      task.internshipId,
      task.studentId
    );

    res.status(200).json({
      message: "Task status updated successfully",
      task,
      progress,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// ==========================================
// STUDENT - GET MY TASKS
// ==========================================

const getMyTasks = async (req, res) => {
  try {
    // Find logged-in student's profile
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Get tasks assigned to this student
    const tasks = await Task.find({
      studentId: student._id,
    })
      .populate(
        "internshipId",
        "title location workMode duration status"
      )
      .sort({
        dueDate: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });

  } catch (error) {
    console.error(
      "Get my tasks error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch student tasks",
      error: error.message,
    });
  }
};

// ==========================================
// COMPANY - DELETE TASK
// ==========================================

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Find logged-in company
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Check task belongs to company's internship
    const internship = await Internship.findOne({
      _id: task.internshipId,
      companyId: company._id,
    });

    if (!internship) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createTask,
  getInternshipTasks,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
};