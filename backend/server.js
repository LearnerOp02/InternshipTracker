const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");
const weeklyReportRoutes = require("./routes/weeklyReportRoutes");
const progressRoutes = require("./routes/progressRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const errorHandler = require("./middleware/errorHandler")
const placementRoutes =
  require("./routes/placementRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/internships", internshipRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use("/api/documents", documentRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/tasks", taskRoutes);
app.use("/api/weekly-reports", weeklyReportRoutes);
app.use("/api/progress", progressRoutes);

app.use(
  "/api/evaluations",
  evaluationRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// ✅ ADD THIS
app.use(
  "/api/placement",
  placementRoutes
);

// KEEP 404 HANDLER LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Student Internship Tracking System API is running",
  });
});

// Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});