const express = require("express");

const {
  createWeeklyReport,
  getMyWeeklyReports,
  getInternshipWeeklyReports,
} = require("../controllers/weeklyReportController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// STUDENT - submit report
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  createWeeklyReport
);

// STUDENT - my reports
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyWeeklyReports
);

// COMPANY / PLACEMENT CELL - internship reports
router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("company", "placement_cell"),
  getInternshipWeeklyReports
);

module.exports = router;