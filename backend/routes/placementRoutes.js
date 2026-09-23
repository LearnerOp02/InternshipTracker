const express = require("express");

const {
  getPlacementReports,
} = require("../controllers/placementController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();


// ==========================================
// PLACEMENT CELL - REPORTS
// ==========================================
router.get(
  "/reports",
  protect,
  authorizeRoles("placement_cell"),
  getPlacementReports
);


module.exports = router;