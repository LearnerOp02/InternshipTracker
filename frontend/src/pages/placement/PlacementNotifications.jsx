/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPlacementNotifications,
  markAllPlacementNotificationsRead,
  markPlacementNotificationRead,
} from "../../services/placementService";


const PlacementNotifications = () => {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    processingId,
    setProcessingId,
  ] = useState(null);


  useEffect(() => {
    loadNotifications();
  }, []);


  const loadNotifications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getPlacementNotifications();

      const list =
        data.notifications ||
        data.data ||
        data ||
        [];

      setNotifications(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (error) {
      console.error(
        "Load notifications error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleMarkRead = async (
    id
  ) => {
    try {
      setProcessingId(id);

      await markPlacementNotificationRead(
        id
      );

      setNotifications(
        (current) =>
          current.map(
            (notification) =>
              notification._id === id
                ? {
                    ...notification,
                    isRead: true,
                    readAt:
                      new Date().toISOString(),
                  }
                : notification
          )
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update notification"
      );
    } finally {
      setProcessingId(null);
    }
  };


  const handleMarkAllRead =
    async () => {
      try {
        setMessage("");

        await markAllPlacementNotificationsRead();

        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                isRead: true,
                readAt:
                  notification.readAt ||
                  new Date().toISOString(),
              })
            )
        );

        setMessage(
          "All notifications marked as read"
        );
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to update notifications"
        );
      }
    };


  const filteredNotifications =
    useMemo(() => {
      if (filter === "unread") {
        return notifications.filter(
          (notification) =>
            !notification.isRead
        );
      }

      if (filter === "read") {
        return notifications.filter(
          (notification) =>
            notification.isRead
        );
      }

      return notifications;
    }, [
      notifications,
      filter,
    ]);


  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;


  const getNotificationTypeClass = (
    type
  ) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700";

      case "warning":
        return "bg-yellow-100 text-yellow-700";

      case "error":
        return "bg-red-100 text-red-700";

      case "application":
        return "bg-blue-100 text-blue-700";

      case "internship":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>
          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 text-gray-500">
            View important placement
            activity and system updates.
          </p>
        </div>


        <button
          onClick={
            handleMarkAllRead
          }
          disabled={
            unreadCount === 0
          }
          className="
            rounded-lg
            bg-black
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Mark All as Read
        </button>

      </div>


      {/* MESSAGE */}
      {message && (
        <div
          className="
            mb-6
            rounded-lg
            border
            bg-blue-50
            p-4
            text-blue-700
          "
        >
          {message}
        </div>
      )}


      {/* SUMMARY */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="mt-1 text-3xl font-bold">
            {notifications.length}
          </p>
        </div>


        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-sm text-gray-500">
            Unread
          </p>

          <p className="mt-1 text-3xl font-bold">
            {unreadCount}
          </p>
        </div>


        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-sm text-gray-500">
            Read
          </p>

          <p className="mt-1 text-3xl font-bold">
            {notifications.length -
              unreadCount}
          </p>
        </div>

      </div>


      {/* FILTER */}
      <div
        className="
          mb-6
          rounded-xl
          border
          bg-white
          p-5
        "
      >
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="
            w-full
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
            md:w-64
          "
        >
          <option value="all">
            All Notifications
          </option>

          <option value="unread">
            Unread
          </option>

          <option value="read">
            Read
          </option>
        </select>
      </div>


      {/* NOTIFICATION LIST */}
      <div className="space-y-4">

        {filteredNotifications.length ===
        0 ? (

          <div
            className="
              rounded-xl
              border
              bg-white
              p-10
              text-center
              text-gray-500
            "
          >
            No notifications found.
          </div>

        ) : (

          filteredNotifications.map(
            (notification) => (

              <div
                key={notification._id}
                className={`
                  rounded-xl
                  border
                  p-5
                  ${
                    notification.isRead
                      ? "bg-white"
                      : "border-blue-200 bg-blue-50"
                  }
                `}
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >

                  <div className="flex-1">

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >

                      <h2
                        className="
                          text-lg
                          font-semibold
                        "
                      >
                        {notification.title ||
                          "Notification"}
                      </h2>


                      {notification.type && (

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            ${getNotificationTypeClass(
                              notification.type
                            )}
                          `}
                        >
                          {notification.type}
                        </span>

                      )}


                      {!notification.isRead && (

                        <span
                          className="
                            rounded-full
                            bg-blue-600
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-white
                          "
                        >
                          New
                        </span>

                      )}

                    </div>


                    <p
                      className="
                        mt-3
                        text-gray-600
                      "
                    >
                      {notification.message ||
                        notification.description ||
                        "-"}
                    </p>


                    <p
                      className="
                        mt-3
                        text-sm
                        text-gray-400
                      "
                    >
                      {notification.createdAt
                        ? new Date(
                            notification.createdAt
                          ).toLocaleString()
                        : "-"}
                    </p>

                  </div>


                  {!notification.isRead && (

                    <button
                      disabled={
                        processingId ===
                        notification._id
                      }
                      onClick={() =>
                        handleMarkRead(
                          notification._id
                        )
                      }
                      className="
                        rounded-lg
                        border
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        hover:bg-gray-50
                        disabled:opacity-50
                      "
                    >
                      Mark as Read
                    </button>

                  )}

                </div>

              </div>
            )
          )

        )}

      </div>

    </div>
  );
};


export default PlacementNotifications;