const express = require("express");

const {
  createInternship,
  getMyInternships,
  getMyInternshipById,
  updateInternship,
  submitInternship,

  getPendingInternships,
  getApprovedInternships,
  approveInternship,
  rejectInternship,
  publishInternship,

  getPublishedInternships,
  getPublishedInternshipById,
  getInternshipEligibility,
  getInternshipMonitoring,
} = require("../controllers/internshipController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Company routes

router.post(
  "/",
  protect,
  authorizeRoles("company"),
  createInternship
);

// ==========================================
// PLACEMENT CELL - INTERNSHIP MONITORING
// ==========================================
router.get(
  "/monitoring",
  protect,
  authorizeRoles("placement_cell"),
  getInternshipMonitoring
);

router.get(
  "/my",
  protect,
  authorizeRoles("company"),
  getMyInternships
);

router.get(
  "/my/:id",
  protect,
  authorizeRoles("company"),
  getMyInternshipById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("company"),
  updateInternship
);

router.get(
  "/approved",
  protect,
  authorizeRoles("placement_cell"),
  getApprovedInternships
);

router.patch(
  "/:id/submit",
  protect,
  authorizeRoles("company"),
  submitInternship
);

// ==========================================
// PLACEMENT CELL ROUTES
// ==========================================

router.get(
  "/pending",
  protect,
  authorizeRoles("placement_cell"),
  getPendingInternships
);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("placement_cell"),
  approveInternship
);

router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("placement_cell"),
  rejectInternship
);

router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("placement_cell"),
  publishInternship
);

// ==========================================
// STUDENT ROUTES
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("student"),
  getPublishedInternships
);

router.get(
  "/:id/eligibility",
  protect,
  authorizeRoles("student"),
  getInternshipEligibility
);

router.get(
  "/:id",
  protect,
  authorizeRoles("student"),
  getPublishedInternshipById
);

module.exports = router;