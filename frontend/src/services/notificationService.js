import api from "./api";


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getMyNotifications = async () => {
  const response = await api.get(
    "/notifications"
  );

  return response.data;
};


// ==========================================
// MARK ONE AS READ
// ==========================================

export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};


// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead =
  async () => {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  };