const express = require("express");

const {
  getAuditLogs,
  getAuditLogById,
  getAllAuditLogs,
} = require("../controllers/auditLogController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("placement_cell"),
  getAuditLogs
);

router.get(
  "/",
  protect,
  authorizeRoles("placement_cell"),
  getAllAuditLogs
);

router.get(
  "/:id",
  protect,
  authorizeRoles("placement_cell"),
  getAuditLogById
);

module.exports = router;