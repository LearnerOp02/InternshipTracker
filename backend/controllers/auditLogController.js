const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
  try {
    const {
      action,
      entityType,
      role,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (entityType) {
      filter.entityType = entityType;
    }

    if (role) {
      filter.role = role;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        filter.createdAt.$lte = end;
      }
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
      });
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error("Get audit log error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit log",
    });
  }
};

// ==========================================
// PLACEMENT CELL - GET ALL AUDIT LOGS
// ==========================================
const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate(
        "userId",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error(
      "Get audit logs error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById,
  getAllAuditLogs,
};