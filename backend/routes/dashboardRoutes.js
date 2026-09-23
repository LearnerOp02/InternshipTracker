const express = require("express");

const {
  getStudentDashboard,
  getCompanyDashboard,
  getPlacementDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// ==========================================
// STUDENT DASHBOARD
// ==========================================
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentDashboard
);

// ==========================================
// COMPANY DASHBOARD
// ==========================================
router.get(
  "/company",
  protect,
  authorizeRoles("company"),
  getCompanyDashboard
);

// ==========================================
// PLACEMENT CELL DASHBOARD
// ==========================================
router.get(
  "/placement",
  protect,
  authorizeRoles("placement_cell"),
  getPlacementDashboard
);

module.exports = router;
