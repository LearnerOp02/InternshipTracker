const Document = require("../models/Document");
const Student = require("../models/Student");
const Application = require("../models/Application");
const Internship = require("../models/Internship");
const { createNotification } = require(
  "../services/notificationService"
);

// ==========================================
// STUDENT - UPLOAD DOCUMENT
// ==========================================

const uploadDocument = async (req, res) => {
  try {
    const { type, internshipId, applicationId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file",
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Document type is required",
      });
    }

    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    // Resume does not require internship/application
    if (type !== "resume") {
      if (!internshipId || !applicationId) {
        return res.status(400).json({
          message:
            "Internship ID and application ID are required for this document",
        });
      }

      const application = await Application.findOne({
        _id: applicationId,
        studentId: student._id,
        internshipId,
      });

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }
    }

    const document = await Document.create({
      studentId: student._id,
      internshipId: internshipId || undefined,
      applicationId: applicationId || undefined,
      type,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.path
        .replace(/^uploads[\\/]/, "")
        .replace(/\\/g, "/")}`,
      verificationStatus: "pending",
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);

    res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

// ==========================================
// STUDENT - GET MY DOCUMENTS
// ==========================================

const getMyDocuments = async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const documents = await Document.find({
      studentId: student._id,
    })
      .populate("internshipId", "title companyId")
      .sort({ createdAt: -1 });

    res.json({
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

// ==========================================
// PLACEMENT CELL - GET INTERNSHIP DOCUMENTS
// ==========================================

const getInternshipDocuments = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const documents = await Document.find({
      internshipId,
    })
      .populate("studentId", "studentId userId department year cgpa")
      .populate("applicationId", "status")
      .sort({ createdAt: -1 });

    res.json({
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get internship documents error:", error);

    res.status(500).json({
      message: "Failed to fetch internship documents",
      error: error.message,
    });
  }
};

// ==========================================
// PLACEMENT CELL - VERIFY DOCUMENT
// ==========================================

const verifyDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.verificationStatus = "verified";
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    document.rejectionReason = undefined;

    await document.save();
    const student = await Student.findById(
      document.studentId
    );

    await createNotification({
      recipient: student.userId,
      title: "Document Verified",
      message: `Your ${document.type.replace(
        "_",
        " "
      )} has been verified by the Placement Cell.`,
      type: "document",
      relatedId: document._id,
    });

    res.json({
      message: "Document verified successfully",
      document,
    });
  } catch (error) {
    console.error("Verify document error:", error);

    res.status(500).json({
      message: "Failed to verify document",
      error: error.message,
    });
  }
};

// ==========================================
// PLACEMENT CELL - REJECT DOCUMENT
// ==========================================

const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.verificationStatus = "rejected";
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    document.rejectionReason = rejectionReason;

    await document.save();
    const student = await Student.findById(
      document.studentId
    );

    await createNotification({
      recipient: student.userId,
      title: "Document Rejected",
      message: `Your document was rejected. Reason: ${rejectionReason}`,
      type: "document",
      relatedId: document._id,
    });

    res.json({
      message: "Document rejected",
      document,
    });
  } catch (error) {
    console.error("Reject document error:", error);

    res.status(500).json({
      message: "Failed to reject document",
      error: error.message,
    });
  }
};

// ==========================================
// PLACEMENT CELL - GET ALL DOCUMENTS
// ==========================================
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error(
      "Get all documents error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getInternshipDocuments,
  verifyDocument,
  rejectDocument,
  getAllDocuments,
};