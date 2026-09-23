import {
  useEffect,
  useState,
} from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";


const CompanyNotifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {
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
          "Load notifications error:",
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
      setSuccess("");

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
          "Failed to mark notification as read"
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      setError("");
      setSuccess("");

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

      setSuccess(
        "All notifications marked as read."
      );

    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark all notifications as read"
      );
    } finally {
      setMarkingAll(false);
    }
  };


  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
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
            View updates about internships,
            applicants and student activity.
          </p>

        </div>


        {unreadCount > 0 && (
          <button
            type="button"
            onClick={
              handleMarkAllRead
            }
            disabled={markingAll}
            className="self-start rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markingAll
              ? "Updating..."
              : "Mark All as Read"}
          </button>
        )}

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* STATS */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <StatCard
            title="Total"
            value={
              notifications.length
            }
          />

          <StatCard
            title="Unread"
            value={
              unreadCount
            }
          />

          <StatCard
            title="Read"
            value={
              notifications.length -
              unreadCount
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
            New company notifications will
            appear here.
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
  const read =
    isNotificationRead(
      notification
    );

  const title =
    notification.title ||
    getNotificationTitle(
      notification.type
    );

  const message =
    notification.message ||
    notification.description ||
    "You have a new notification.";


  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition ${
        read
          ? "border-slate-200 bg-white"
          : "border-blue-200 bg-blue-50/50"
      }`}
    >

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div className="flex gap-4">

          {/* ICON */}

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
              read
                ? "bg-slate-100 text-slate-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {getNotificationIcon(
              notification.type
            )}
          </div>


          {/* CONTENT */}

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h2
                className={`font-semibold ${
                  read
                    ? "text-slate-800"
                    : "text-slate-950"
                }`}
              >
                {title}
              </h2>


              {!read && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  New
                </span>
              )}

            </div>


            <p className="mt-1 text-sm leading-6 text-slate-600">
              {message}
            </p>


            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">

              <span>
                {formatDateTime(
                  notification.createdAt
                )}
              </span>


              {notification.type && (
                <span className="capitalize">
                  {notification.type.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              )}

            </div>

          </div>

        </div>


        {/* MARK READ */}

        {!read && (
          <button
            type="button"
            onClick={() =>
              onMarkRead(
                notification._id
              )
            }
            disabled={updating}
            className="self-start whitespace-nowrap rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
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

const StatCard = ({
  title,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      {value}
    </p>

  </div>
);


// ==========================================
// IS READ
// ==========================================

const isNotificationRead = (
  notification
) => {
  return (
    notification.isRead === true ||
    notification.read === true ||
    Boolean(
      notification.readAt
    )
  );
};


// ==========================================
// NOTIFICATION TITLE
// ==========================================

const getNotificationTitle = (
  type
) => {
  const titles = {
    internship_approved:
      "Internship Approved",

    internship_rejected:
      "Internship Rejected",

    internship_published:
      "Internship Published",

    new_application:
      "New Application",

    application_received:
      "New Application",

    task_completed:
      "Task Completed",

    weekly_report_submitted:
      "Weekly Report Submitted",

    document_uploaded:
      "Document Uploaded",

    evaluation_required:
      "Evaluation Required",

    interview_reminder:
      "Interview Reminder",
  };

  return (
    titles[type] ||
    "Notification"
  );
};


// ==========================================
// NOTIFICATION ICON
// ==========================================

const getNotificationIcon = (
  type
) => {
  const icons = {
    internship_approved:
      "✓",

    internship_rejected:
      "!",

    internship_published:
      "↗",

    new_application:
      "A",

    application_received:
      "A",

    task_completed:
      "T",

    weekly_report_submitted:
      "R",

    document_uploaded:
      "D",

    evaluation_required:
      "E",

    interview_reminder:
      "I",
  };

  return (
    icons[type] ||
    "N"
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

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "N/A";
  }

  return parsed.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


export default CompanyNotifications;