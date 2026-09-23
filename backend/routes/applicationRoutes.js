const express = require("express");

const {
  applyForInternship,
  getMyApplications,
  getMyApplicationById,

  getInternshipApplicants,
  updateApplicationStatus,
  scheduleInterview,
  getInterview,
  selectApplication,
  getAllApplications,
} = require("../controllers/applicationController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// ==========================================
// STUDENT ROUTES
// ==========================================

// ==========================================
// PLACEMENT CELL - GET ALL APPLICATIONS
// ==========================================
router.get(
  "/all",
  protect,
  authorizeRoles("placement_cell"),
  getAllApplications
);

// Apply for internship
router.post(
  "/internship/:internshipId",
  protect,
  authorizeRoles("student"),
  applyForInternship
);

// Get my applications
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyApplications
);

// ==========================================
// COMPANY ROUTES
// ==========================================

// View applicants for an internship
router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("company"),
  getInternshipApplicants
);

// Update application status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("company"),
  updateApplicationStatus
);

// Schedule interview
router.post(
  "/:id/interview",
  protect,
  authorizeRoles("company"),
  scheduleInterview
);

// Select candidate
router.patch(
  "/:id/select",
  protect,
  authorizeRoles("company"),
  selectApplication
);

// ==========================================
// BOTH STUDENT + COMPANY
// ==========================================

// Get interview details
router.get(
  "/:id/interview",
  protect,
  authorizeRoles("student", "company"),
  getInterview
);

// Student gets single application
router.get(
  "/:id",
  protect,
  authorizeRoles("student"),
  getMyApplicationById
);

module.exports = router;