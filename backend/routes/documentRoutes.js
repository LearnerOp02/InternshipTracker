const express = require("express");

const {
  uploadDocument,
  getMyDocuments,
  getInternshipDocuments,
  verifyDocument,
  rejectDocument,
  getAllDocuments,
} = require("../controllers/documentController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../middleware/upload");

const router = express.Router();

// ==========================================
// STUDENT
// ==========================================

// Upload document
router.post(
  "/upload",
  protect,
  authorizeRoles("student"),
  upload.single("file"),
  uploadDocument
);

router.get(
  "/all",
  protect,
  authorizeRoles("placement_cell"),
  getAllDocuments
);

// Get my documents
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyDocuments
);

// ==========================================
// PLACEMENT CELL
// ==========================================

// Get documents for an internship
router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("placement_cell"),
  getInternshipDocuments
);

// Verify document
router.patch(
  "/:id/verify",
  protect,
  authorizeRoles("placement_cell"),
  verifyDocument
);

// Reject document
router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("placement_cell"),
  rejectDocument
);

module.exports = router;