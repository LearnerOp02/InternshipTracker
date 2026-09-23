const express = require("express");

const {
  getMyProgress,
  getInternshipProgress,
} = require("../controllers/progressController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// STUDENT
router.get(
  "/my/:internshipId",
  protect,
  authorizeRoles("student"),
  getMyProgress
);

// COMPANY / PLACEMENT CELL
router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("company", "placement_cell"),
  getInternshipProgress
);

module.exports = router;