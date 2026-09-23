const express = require("express");

const {
  createTask,
  getInternshipTasks,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();


// ==========================================
// COMPANY - CREATE TASK
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("company"),
  createTask
);


// ==========================================
// STUDENT - GET MY TASKS
// ==========================================

router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyTasks
);

// COMPANY - DELETE TASK

router.delete(
  "/:id",
  protect,
  authorizeRoles("company"),
  deleteTask
);

// ==========================================
// COMPANY / PLACEMENT CELL
// GET INTERNSHIP TASKS
// ==========================================

router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles(
    "company",
    "placement_cell"
  ),
  getInternshipTasks
);


// ==========================================
// COMPANY - UPDATE TASK
// ==========================================

router.put(
  "/:id",
  protect,
  authorizeRoles("company"),
  updateTask
);


// ==========================================
// STUDENT - UPDATE TASK STATUS
// ==========================================

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("student"),
  updateTaskStatus
);


module.exports = router;