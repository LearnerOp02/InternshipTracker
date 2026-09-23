const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  title,
  message,
  type = "system",
  relatedId,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedId,
    });

    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error.message
    );

    return null;
  }
};

module.exports = {
  createNotification,
};