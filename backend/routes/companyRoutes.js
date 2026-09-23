const express = require("express");

const {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getAllCompanies,
} = require("../controllers/companyController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Get company profile
router.get(
  "/me",
  protect,
  authorizeRoles("company"),
  getMyProfile
);

// Create company profile
router.post(
  "/me",
  protect,
  authorizeRoles("company"),
  createProfile
);

// ==========================================
// PLACEMENT CELL - GET ALL COMPANIES
// ==========================================
router.get(
  "/",
  protect,
  authorizeRoles("placement_cell"),
  getAllCompanies
);

// Update company profile
router.put(
  "/me",
  protect,
  authorizeRoles("company"),
  updateMyProfile
);

// Placement Cell - Get pending companies
router.get(
  "/pending",
  protect,
  authorizeRoles("placement_cell"),
  getPendingCompanies
);

// Placement Cell - Approve company
router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("placement_cell"),
  approveCompany
);

// Placement Cell - Reject company
router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("placement_cell"),
  rejectCompany
);

module.exports = router;