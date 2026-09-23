const express = require("express");

const {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getAllStudents,
} = require("../controllers/studentController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Get my profile
router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getMyProfile
);

// ==========================================
// PLACEMENT CELL - GET ALL STUDENTS
// ==========================================
router.get(
  "/all",
  protect,
  authorizeRoles("placement_cell"),
  getAllStudents
);

// Create profile
router.post(
  "/me",
  protect,
  authorizeRoles("student"),
  createProfile
);

// Update profile
router.put(
  "/me",
  protect,
  authorizeRoles("student"),
  updateMyProfile
);

module.exports = router;