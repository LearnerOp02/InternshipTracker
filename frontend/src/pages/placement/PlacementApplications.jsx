/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllApplications,
} from "../../services/placementService";

const PlacementApplications = () => {
  const [
    applications,
    setApplications,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");


  useEffect(() => {
    loadApplications();
  }, []);


  const loadApplications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getAllApplications();

      const list =
        data.applications ||
        data.data ||
        data ||
        [];

      setApplications(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (error) {
      console.error(
        "Load applications error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };


  const filteredApplications =
    useMemo(() => {
      return applications.filter(
        (application) => {
          const studentName =
            application.studentId
              ?.userId?.name ||
            "";

          const studentEmail =
            application.studentId
              ?.userId?.email ||
            "";

          const internshipTitle =
            application.internshipId
              ?.title ||
            "";

          const companyName =
            application.internshipId
              ?.companyId
              ?.companyName ||
            "";

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            studentName
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            studentEmail
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            internshipTitle
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            companyName
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            !status ||
            application.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      applications,
      search,
      status,
    ]);


  const getStatusClass = (
    applicationStatus
  ) => {
    switch (applicationStatus) {
      case "selected":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "shortlisted":
        return "bg-blue-100 text-blue-700";

      case "interview_scheduled":
        return "bg-purple-100 text-purple-700";

      case "under_review":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading applications...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Applications Management
        </h1>

        <p className="mt-2 text-gray-500">
          View internship applications
          across all students and
          companies.
        </p>

      </div>


      {/* ERROR */}
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

        <div
          className="
            rounded-xl
            border
            bg-white
            p-5
          "
        >
          <p className="text-sm text-gray-500">
            Total Applications
          </p>

          <p className="mt-1 text-3xl font-bold">
            {applications.length}
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
            Selected
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.status ===
                  "selected"
              ).length
            }
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
            Shortlisted
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.status ===
                  "shortlisted"
              ).length
            }
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
            Rejected
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              applications.filter(
                (item) =>
                  item.status ===
                  "rejected"
              ).length
            }
          </p>
        </div>

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
          md:grid-cols-2
        "
      >

        <input
          type="text"
          placeholder="Search student, internship or company"
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
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
          "
        >
          <option value="">
            All Statuses
          </option>

          <option value="applied">
            Applied
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="shortlisted">
            Shortlisted
          </option>

          <option value="interview_scheduled">
            Interview Scheduled
          </option>

          <option value="selected">
            Selected
          </option>

          <option value="rejected">
            Rejected
          </option>

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
                  Student
                </th>

                <th className="p-4">
                  Internship
                </th>

                <th className="p-4">
                  Company
                </th>

                <th className="p-4">
                  Applied On
                </th>

                <th className="p-4">
                  Status
                </th>

              </tr>
            </thead>


            <tbody>

              {filteredApplications.length ===
              0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >
                    No applications found.
                  </td>
                </tr>

              ) : (

                filteredApplications.map(
                  (application) => (

                    <tr
                      key={application._id}
                      className="
                        border-b
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >

                      {/* STUDENT */}
                      <td className="p-4">

                        <p className="font-semibold">
                          {application
                            .studentId
                            ?.userId
                            ?.name ||
                            "Student"}
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-gray-500
                          "
                        >
                          {application
                            .studentId
                            ?.userId
                            ?.email ||
                            "-"}
                        </p>

                      </td>


                      {/* INTERNSHIP */}
                      <td className="p-4">

                        {application
                          .internshipId
                          ?.title ||
                          "-"}

                      </td>


                      {/* COMPANY */}
                      <td className="p-4">

                        {application
                          .internshipId
                          ?.companyId
                          ?.companyName ||
                          "-"}

                      </td>


                      {/* DATE */}
                      <td className="p-4">

                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      {/* STATUS */}
                      <td className="p-4">

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-medium
                            ${getStatusClass(
                              application.status
                            )}
                          `}
                        >
                          {application.status ||
                            "applied"}
                        </span>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default PlacementApplications;