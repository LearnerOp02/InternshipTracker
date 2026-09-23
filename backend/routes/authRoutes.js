const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected test route
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Student-only test route
router.get(
  "/student-test",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Student!",
      user: req.user,
    });
  }
);

module.exports = router;