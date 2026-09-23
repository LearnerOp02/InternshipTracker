const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  userId,
  role,
  action,
  entityType,
  entityId,
  description,
  metadata = {},
  ipAddress,
}) => {
  try {
    await AuditLog.create({
      userId,
      role,
      action,
      entityType,
      entityId,
      description,
      metadata,
      ipAddress,
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

module.exports = {
  createAuditLog,
};