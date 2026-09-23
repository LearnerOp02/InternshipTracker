/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getInternshipMonitoring,
} from "../../services/placementService";


const InternshipMonitoring = () => {
  const [
    internships,
    setInternships,
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
    loadMonitoringData();
  }, []);


  const loadMonitoringData =
    async () => {
      try {
        setLoading(true);
        setMessage("");

        const data =
          await getInternshipMonitoring();

        const list =
          data.internships ||
          data.data ||
          data ||
          [];

        setInternships(
          Array.isArray(list)
            ? list
            : []
        );
      } catch (error) {
        console.error(
          "Load monitoring error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Failed to load internship monitoring data"
        );
      } finally {
        setLoading(false);
      }
    };


  const filteredInternships =
    useMemo(() => {
      return internships.filter(
        (item) => {
          const internship =
            item.internship || {};

          const title =
            internship.title || "";

          const companyName =
            internship.companyId
              ?.companyName || "";

          const currentStatus =
            internship.status || "";

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            title
              .toLowerCase()
              .includes(searchValue) ||
            companyName
              .toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            !status ||
            currentStatus === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      internships,
      search,
      status,
    ]);


  const ongoingCount =
    internships.filter(
      (item) =>
        item.internship?.status ===
        "ongoing"
    ).length;


  const completedCount =
    internships.filter(
      (item) =>
        item.internship?.status ===
        "completed"
    ).length;


  const totalSelected =
    internships.reduce(
      (total, item) =>
        total +
        (item.selectedCount || 0),
      0
    );


  const getStatusClass = (
    currentStatus
  ) => {
    switch (currentStatus) {
      case "ongoing":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "published":
        return "bg-purple-100 text-purple-700";

      case "application_closed":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading internship monitoring...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Internship Monitoring
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor internships, selected
          students and task progress.
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


      {/* STATS */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-4
        "
      >

        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Total Internships
          </p>

          <p className="mt-1 text-3xl font-bold">
            {internships.length}
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Ongoing
          </p>

          <p className="mt-1 text-3xl font-bold">
            {ongoingCount}
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Completed
          </p>

          <p className="mt-1 text-3xl font-bold">
            {completedCount}
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Selected Students
          </p>

          <p className="mt-1 text-3xl font-bold">
            {totalSelected}
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
          placeholder="Search internship or company"
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

          <option value="published">
            Published
          </option>

          <option value="application_closed">
            Application Closed
          </option>

          <option value="ongoing">
            Ongoing
          </option>

          <option value="completed">
            Completed
          </option>

        </select>

      </div>


      {/* INTERNSHIP CARDS */}
      <div className="space-y-5">

        {filteredInternships.length ===
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
            No internships found.
          </div>

        ) : (

          filteredInternships.map(
            (item) => {
              const internship =
                item.internship || {};

              return (
                <div
                  key={
                    internship._id
                  }
                  className="
                    rounded-xl
                    border
                    bg-white
                    p-6
                  "
                >

                  {/* TOP */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      lg:flex-row
                      lg:items-start
                      lg:justify-between
                    "
                  >

                    <div>

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >

                        <h2
                          className="
                            text-xl
                            font-bold
                          "
                        >
                          {internship.title}
                        </h2>

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-medium
                            ${getStatusClass(
                              internship.status
                            )}
                          `}
                        >
                          {internship.status}
                        </span>

                      </div>


                      <p
                        className="
                          mt-2
                          text-gray-600
                        "
                      >
                        {internship
                          .companyId
                          ?.companyName ||
                          "Company"}
                      </p>

                    </div>


                    <div
                      className="
                        rounded-lg
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                      "
                    >
                      <p className="text-gray-500">
                        Selected Students
                      </p>

                      <p className="text-xl font-bold">
                        {item.selectedCount ||
                          0}
                      </p>
                    </div>

                  </div>


                  {/* DETAILS */}
                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-1
                      gap-4
                      md:grid-cols-3
                    "
                  >

                    <div>
                      <p className="text-sm text-gray-500">
                        Location
                      </p>

                      <p className="font-medium">
                        {internship.location ||
                          "-"}
                      </p>
                    </div>


                    <div>
                      <p className="text-sm text-gray-500">
                        Work Mode
                      </p>

                      <p className="font-medium">
                        {internship.workMode ||
                          "-"}
                      </p>
                    </div>


                    <div>
                      <p className="text-sm text-gray-500">
                        Duration
                      </p>

                      <p className="font-medium">
                        {internship.duration ||
                          "-"}
                      </p>
                    </div>

                  </div>


                  {/* PROGRESS */}
                  <div className="mt-6">

                    <div
                      className="
                        mb-2
                        flex
                        justify-between
                        text-sm
                      "
                    >
                      <span className="font-medium">
                        Task Progress
                      </span>

                      <span>
                        {item.completedTasks ||
                          0}
                        /
                        {item.totalTasks ||
                          0}{" "}
                        tasks
                      </span>
                    </div>


                    <div
                      className="
                        h-3
                        overflow-hidden
                        rounded-full
                        bg-gray-200
                      "
                    >
                      <div
                        className="
                          h-full
                          bg-black
                          transition-all
                        "
                        style={{
                          width: `${
                            item.progress || 0
                          }%`,
                        }}
                      />
                    </div>


                    <p
                      className="
                        mt-2
                        text-right
                        text-sm
                        font-semibold
                      "
                    >
                      {item.progress || 0}%
                    </p>

                  </div>


                  {/* SELECTED STUDENTS */}
                  {item.selectedStudents
                    ?.length > 0 && (

                    <div className="mt-6">

                      <h3 className="mb-3 font-semibold">
                        Selected Students
                      </h3>


                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-3
                          md:grid-cols-2
                          xl:grid-cols-3
                        "
                      >

                        {item.selectedStudents.map(
                          (student) => (

                            <div
                              key={
                                student._id
                              }
                              className="
                                rounded-lg
                                border
                                p-4
                              "
                            >

                              <p className="font-medium">
                                {student.userId
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
                                {student.userId
                                  ?.email ||
                                  "-"}
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-sm
                                "
                              >
                                {student.department ||
                                  "-"}{" "}
                                • Year{" "}
                                {student.year ||
                                  "-"}
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>
              );
            }
          )

        )}

      </div>

    </div>
  );
};


export default InternshipMonitoring;