const Notification = require("../models/Notification");

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findOne({
        _id: id,
        recipient: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllNotificationsAsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    res.json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update notifications",
      error: error.message,
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================
const markNotificationRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update notification",
      error: error.message,
    });
  }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
const markAllNotificationsRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update notifications",
      error: error.message,
    });
  }
};


module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};