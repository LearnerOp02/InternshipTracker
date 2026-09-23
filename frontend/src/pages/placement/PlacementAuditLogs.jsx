/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAuditLogs,
} from "../../services/placementService";


const PlacementAuditLogs = () => {
  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [action, setAction] =
    useState("");


  useEffect(() => {
    loadLogs();
  }, []);


  const loadLogs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getAuditLogs();

      const list =
        data.logs ||
        data.data ||
        data ||
        [];

      setLogs(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (error) {
      console.error(
        "Load audit logs error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  };


  const actions = useMemo(() => {
    return [
      ...new Set(
        logs
          .map(
            (log) =>
              log.action
          )
          .filter(Boolean)
      ),
    ];
  }, [logs]);


  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const name =
        log.userId?.name ||
        log.userName ||
        "";

      const email =
        log.userId?.email ||
        log.userEmail ||
        "";

      const userRole =
        log.userId?.role ||
        log.role ||
        "";

      const currentAction =
        log.action || "";

      const entity =
        log.entityType ||
        log.entity ||
        "";

      const description =
        log.description ||
        log.details ||
        log.message ||
        "";

      const searchValue =
        search
          .trim()
          .toLowerCase();

      const matchesSearch =
        !searchValue ||
        name
          .toLowerCase()
          .includes(searchValue) ||
        email
          .toLowerCase()
          .includes(searchValue) ||
        currentAction
          .toLowerCase()
          .includes(searchValue) ||
        entity
          .toLowerCase()
          .includes(searchValue) ||
        description
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        !role ||
        userRole === role;

      const matchesAction =
        !action ||
        currentAction === action;

      return (
        matchesSearch &&
        matchesRole &&
        matchesAction
      );
    });
  }, [
    logs,
    search,
    role,
    action,
  ]);


  const getRoleClass = (
    userRole
  ) => {
    switch (userRole) {
      case "placement_cell":
        return "bg-purple-100 text-purple-700";

      case "company":
        return "bg-blue-100 text-blue-700";

      case "student":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading audit logs...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Audit Logs
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor important actions
          performed across the internship
          tracking system.
        </p>

      </div>


      {/* MESSAGE */}
      {message && (
        <div
          className="
            mb-6
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
            text-red-700
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
          md:grid-cols-4
        "
      >

        <StatCard
          title="Total Logs"
          value={logs.length}
        />

        <StatCard
          title="Student Actions"
          value={
            logs.filter(
              (log) =>
                (
                  log.userId?.role ||
                  log.role
                ) ===
                "student"
            ).length
          }
        />

        <StatCard
          title="Company Actions"
          value={
            logs.filter(
              (log) =>
                (
                  log.userId?.role ||
                  log.role
                ) ===
                "company"
            ).length
          }
        />

        <StatCard
          title="Placement Actions"
          value={
            logs.filter(
              (log) =>
                (
                  log.userId?.role ||
                  log.role
                ) ===
                "placement_cell"
            ).length
          }
        />

      </div>


      {/* FILTERS */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          rounded-xl
          border
          bg-white
          p-5
          md:grid-cols-3
        "
      >

        <input
          type="text"
          placeholder="Search user, action or details"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />


        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
          "
        >
          <option value="">
            All Roles
          </option>

          <option value="student">
            Student
          </option>

          <option value="company">
            Company
          </option>

          <option value="placement_cell">
            Placement Cell
          </option>
        </select>


        <select
          value={action}
          onChange={(e) =>
            setAction(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
          "
        >
          <option value="">
            All Actions
          </option>

          {actions.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

      </div>


      {/* TABLE */}
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead
              className="
                border-b
                bg-gray-50
              "
            >

              <tr>

                <th className="p-4">
                  User
                </th>

                <th className="p-4">
                  Role
                </th>

                <th className="p-4">
                  Action
                </th>

                <th className="p-4">
                  Entity
                </th>

                <th className="p-4">
                  Details
                </th>

                <th className="p-4">
                  Date
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredLogs.length ===
              0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >
                    No audit logs found.
                  </td>
                </tr>

              ) : (

                filteredLogs.map(
                  (log) => {

                    const userRole =
                      log.userId?.role ||
                      log.role ||
                      "unknown";

                    return (
                      <tr
                        key={log._id}
                        className="
                          border-b
                          last:border-b-0
                          hover:bg-gray-50
                        "
                      >

                        {/* USER */}
                        <td className="p-4">

                          <p className="font-medium">
                            {log.userId
                              ?.name ||
                              log.userName ||
                              "System"}
                          </p>

                          <p
                            className="
                              mt-1
                              text-sm
                              text-gray-500
                            "
                          >
                            {log.userId
                              ?.email ||
                              log.userEmail ||
                              "-"}
                          </p>

                        </td>


                        {/* ROLE */}
                        <td className="p-4">

                          <span
                            className={`
                              rounded-full
                              px-3
                              py-1
                              text-sm
                              font-medium
                              ${getRoleClass(
                                userRole
                              )}
                            `}
                          >
                            {userRole}
                          </span>

                        </td>


                        {/* ACTION */}
                        <td className="p-4">

                          <span className="font-medium">
                            {log.action ||
                              "-"}
                          </span>

                        </td>


                        {/* ENTITY */}
                        <td className="p-4">

                          {log.entityType ||
                            log.entity ||
                            "-"}

                        </td>


                        {/* DETAILS */}
                        <td
                          className="
                            max-w-sm
                            p-4
                          "
                        >

                          <p
                            className="
                              line-clamp-3
                              text-sm
                              text-gray-600
                            "
                          >
                            {log.description ||
                              log.details ||
                              log.message ||
                              "-"}
                          </p>

                        </td>


                        {/* DATE */}
                        <td className="p-4">

                          <p className="text-sm">

                            {log.createdAt
                              ? new Date(
                                  log.createdAt
                                ).toLocaleDateString()
                              : "-"}

                          </p>

                          {log.createdAt && (

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-500
                              "
                            >

                              {new Date(
                                log.createdAt
                              ).toLocaleTimeString()}

                            </p>

                          )}

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

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
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-5
      "
    >

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
};


export default PlacementAuditLogs;