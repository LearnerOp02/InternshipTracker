const express = require("express");

const {
  createEvaluation,
  updateEvaluation,
  getInternshipEvaluations,
} = require("../controllers/evaluationController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// COMPANY - create evaluation
router.post(
  "/",
  protect,
  authorizeRoles("company"),
  createEvaluation
);

// COMPANY - update evaluation
router.put(
  "/:id",
  protect,
  authorizeRoles("company"),
  updateEvaluation
);

// COMPANY / PLACEMENT CELL - view evaluations
router.get(
  "/internship/:internshipId",
  protect,
  authorizeRoles("company", "placement_cell"),
  getInternshipEvaluations
);

module.exports = router;