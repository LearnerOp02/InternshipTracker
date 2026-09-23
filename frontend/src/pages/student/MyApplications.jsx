import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyApplications,
} from "../../services/applicationService";

const MyApplications = () => {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadApplications =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getMyApplications();

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
            "Applications error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Failed to load applications"
          );
        } finally {
          setLoading(false);
        }
      };

    loadApplications();
  }, []);

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          My Applications
        </h1>

        <p className="mt-1 text-slate-500">
          Track the status of all your
          internship applications.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}


      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-lg font-semibold">
            No applications yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Browse available internships
            and submit your first
            application.
          </p>

          <Link
            to="/student/internships"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Browse Internships
          </Link>

        </div>
      ) : (
        <div className="space-y-4">

          {applications.map(
            (application) => (
              <ApplicationCard
                key={application._id}
                application={
                  application
                }
              />
            )
          )}

        </div>
      )}

    </div>
  );
};


const ApplicationCard = ({
  application,
}) => {
  const internship =
    application.internshipId;

  const company =
    application.companyId;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-xl font-semibold text-slate-900">
              {internship?.title ||
                "Internship"}
            </h2>

            <StatusBadge
              status={
                application.status
              }
            />

          </div>


          <p className="mt-2 font-medium text-blue-600">
            {company?.companyName ||
              internship?.companyId
                ?.companyName ||
              "Company"}
          </p>


          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">

            <span>
              Applied:{" "}
              {formatDate(
                application.appliedAt
              )}
            </span>

            {internship?.location && (
              <span>
                Location:{" "}
                {
                  internship.location
                }
              </span>
            )}

            {internship?.workMode && (
              <span className="capitalize">
                Mode:{" "}
                {
                  internship.workMode
                }
              </span>
            )}

          </div>

        </div>


        <Link
          to={`/student/applications/${application._id}`}
          className="self-start rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 md:self-auto"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};


const StatusBadge = ({
  status,
}) => {
  const styles = {
    applied:
      "bg-blue-50 text-blue-700",

    under_review:
      "bg-yellow-50 text-yellow-700",

    shortlisted:
      "bg-purple-50 text-purple-700",

    interview_scheduled:
      "bg-orange-50 text-orange-700",

    selected:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status
        ?.replaceAll("_", " ") ||
        "Unknown"}
    </span>
  );
};


const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString();
};

export default MyApplications;