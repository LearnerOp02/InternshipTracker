/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const StudentNotifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [markingAll, setMarkingAll] =
    useState(false);


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyNotifications();

      const notificationList =
        data.notifications ||
        data.data ||
        data ||
        [];

      setNotifications(
        Array.isArray(notificationList)
          ? notificationList
          : []
      );
    } catch (error) {
      console.error(
        "Notifications error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadNotifications();
  }, []);


  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkRead = async (
    notificationId
  ) => {
    try {
      setUpdatingId(
        notificationId
      );

      setError("");

      await markNotificationAsRead(
        notificationId
      );

      setNotifications(
        (previous) =>
          previous.map(
            (notification) =>
              notification._id ===
              notificationId
                ? {
                    ...notification,
                    isRead: true,
                    read: true,
                  }
                : notification
          )
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update notification"
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllRead =
    async () => {
      try {
        setMarkingAll(true);
        setError("");

        await markAllNotificationsAsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
                read: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Mark all notifications error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to mark notifications as read"
        );
      } finally {
        setMarkingAll(false);
      }
    };


  // ==========================================
  // STATS
  // ==========================================

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !isNotificationRead(
          notification
        )
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-slate-500">
            View updates related to your
            applications and internship.
          </p>

        </div>


        {unreadNotifications > 0 && (
          <button
            onClick={
              handleMarkAllRead
            }
            disabled={markingAll}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markingAll
              ? "Updating..."
              : "Mark All as Read"}
          </button>
        )}

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* STATS */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <NotificationStatCard
            title="Total Notifications"
            value={
              totalNotifications
            }
          />

          <NotificationStatCard
            title="Unread"
            value={
              unreadNotifications
            }
          />

        </div>
      )}


      {/* NOTIFICATION LIST */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No notifications
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            New updates will appear
            here.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {notifications.map(
            (notification) => (
              <NotificationCard
                key={
                  notification._id
                }
                notification={
                  notification
                }
                updating={
                  updatingId ===
                  notification._id
                }
                onMarkRead={
                  handleMarkRead
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
};


// ==========================================
// NOTIFICATION CARD
// ==========================================

const NotificationCard = ({
  notification,
  updating,
  onMarkRead,
}) => {
  const isRead =
    isNotificationRead(
      notification
    );

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition ${
        isRead
          ? "border-slate-200 bg-white"
          : "border-blue-200 bg-blue-50"
      }`}
    >

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div className="flex gap-4">

          {/* INDICATOR */}

          <div
            className={`mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
              isRead
                ? "bg-slate-300"
                : "bg-blue-600"
            }`}
          />


          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-semibold text-slate-900">
                {notification.title ||
                  getNotificationTitle(
                    notification.type
                  )}
              </h3>


              {!isRead && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  New
                </span>
              )}

            </div>


            <p className="mt-2 text-sm leading-6 text-slate-600">
              {notification.message ||
                "You have a new notification."}
            </p>


            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

              {notification.type && (
                <span className="capitalize">
                  {notification.type.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              )}

              <span>
                {formatDateTime(
                  notification.createdAt
                )}
              </span>

            </div>

          </div>

        </div>


        {!isRead && (
          <button
            onClick={() =>
              onMarkRead(
                notification._id
              )
            }
            disabled={updating}
            className="self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {updating
              ? "Updating..."
              : "Mark as Read"}
          </button>
        )}

      </div>

    </div>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const NotificationStatCard = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// CHECK READ STATUS
// ==========================================

const isNotificationRead = (
  notification
) => {
  if (
    typeof notification.isRead ===
    "boolean"
  ) {
    return notification.isRead;
  }

  if (
    typeof notification.read ===
    "boolean"
  ) {
    return notification.read;
  }

  return false;
};


// ==========================================
// DEFAULT TITLE
// ==========================================

const getNotificationTitle = (
  type
) => {
  const titles = {
    application_status:
      "Application Update",

    new_task:
      "New Task Assigned",

    task_assigned:
      "New Task Assigned",

    interview_scheduled:
      "Interview Scheduled",

    selected:
      "Application Selected",

    rejected:
      "Application Update",

    document_verified:
      "Document Verified",

    document_rejected:
      "Document Rejected",

    internship:
      "Internship Update",
  };

  return (
    titles[type] ||
    "Notification"
  );
};


// ==========================================
// DATE
// ==========================================

const formatDateTime = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleString();
};


export default StudentNotifications;