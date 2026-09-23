const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/auth");

const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

// Existing endpoint
router.get(
  "/",
  protect,
  getMyNotifications
);

// Placement / alternative endpoint
router.get(
  "/my",
  protect,
  getMyNotifications
);


// ==========================================
// MARK ALL AS READ
// IMPORTANT: Keep static route before dynamic route
// ==========================================

router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);


// ==========================================
// MARK ONE AS READ
// ==========================================

router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);


module.exports = router;