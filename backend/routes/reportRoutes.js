const express = require("express");

const {
  getInternshipReport,
  getStudentReport,
  getCompanyReport,
  getApplicationReport,
  getDepartmentReport,
  getDocumentReport,
} = require("../controllers/reportController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// ==========================================
// ALL REPORTS ARE FOR PLACEMENT CELL
// ==========================================

// Internship Report
router.get(
  "/internships",
  protect,
  authorizeRoles("placement_cell"),
  getInternshipReport
);

// Student Report
router.get(
  "/students",
  protect,
  authorizeRoles("placement_cell"),
  getStudentReport
);

// Company Report
router.get(
  "/companies",
  protect,
  authorizeRoles("placement_cell"),
  getCompanyReport
);

// Application Report
router.get(
  "/applications",
  protect,
  authorizeRoles("placement_cell"),
  getApplicationReport
);

// Department Report
router.get(
  "/departments",
  protect,
  authorizeRoles("placement_cell"),
  getDepartmentReport
);

// Document Report
router.get(
  "/documents",
  protect,
  authorizeRoles("placement_cell"),
  getDocumentReport
);

module.exports = router;
