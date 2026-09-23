const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolders = {
  resume: "uploads/resumes",
  offer_letter: "uploads/offers",
  joining_letter: "uploads/joining",
  certificate: "uploads/certificates",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type;

    const folder = uploadFolders[type];

    if (!folder) {
      return cb(new Error("Invalid document type"));
    }

    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const fileName = `${Date.now()}-${safeName}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;