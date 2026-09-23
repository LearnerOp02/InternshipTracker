const Company = require("../models/Company");
const { createAuditLog } = require("../services/auditLogService");

// ==========================================
// GET LOGGED-IN COMPANY'S PROFILE
// ==========================================

const getMyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    }).populate("userId", "name email role");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get company profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// CREATE COMPANY PROFILE
// ==========================================

const createProfile = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      description,
      website,
      location,
      contactPerson,
      contactEmail,
      contactPhone,
    } = req.body;

    // Check required field
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Check if profile already exists
    const existingProfile = await Company.findOne({
      userId: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Company profile already exists",
      });
    }

    // Create company profile
    const company = await Company.create({
      userId: req.user._id,
      companyName,
      industry,
      description,
      website,
      location,
      contactPerson,
      contactEmail,
      contactPhone,
    });

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "COMPANY_PROFILE_CREATED",
      entityType: "Company",
      entityId: company._id,
      description: `Company profile "${company.companyName}" was created`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      company,
    });
  } catch (error) {
    console.error("Create company profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE LOGGED-IN COMPANY'S PROFILE
// ==========================================

const updateMyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({
      userId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const allowedFields = [
      "companyName",
      "industry",
      "description",
      "website",
      "location",
      "contactPerson",
      "contactEmail",
      "contactPhone",
    ];

    let updatedFields = [];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
        updatedFields.push(field);
      }
    });

    await company.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "COMPANY_PROFILE_UPDATED",
      entityType: "Company",
      entityId: company._id,
      description: `Company profile "${company.companyName}" was updated`,
      metadata: {
        updatedFields,
      },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update company profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET COMPANIES PENDING VERIFICATION
// ==========================================

const getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      verificationStatus: "pending",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get pending companies error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// APPROVE COMPANY
// ==========================================

const approveCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.verificationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Company is already approved",
      });
    }

    company.verificationStatus = "approved";
    company.rejectionReason = undefined;

    await company.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "COMPANY_APPROVED",
      entityType: "Company",
      entityId: company._id,
      description: `Company "${company.companyName}" was approved`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Company approved successfully",
      company,
    });
  } catch (error) {
    console.error("Approve company error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// REJECT COMPANY
// ==========================================

const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    company.verificationStatus = "rejected";
    company.rejectionReason = rejectionReason;

    await company.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await createAuditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "COMPANY_REJECTED",
      entityType: "Company",
      entityId: company._id,
      description: `Company "${company.companyName}" was rejected`,
      metadata: {
        rejectionReason,
      },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Company rejected successfully",
      company,
    });
  } catch (error) {
    console.error("Reject company error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate(
        "userId",
        "name email role isActive"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Get all companies error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch companies",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getMyProfile,
  createProfile,
  updateMyProfile,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getAllCompanies,
};

