import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getInternshipHistory,
} from "../../services/applicationService";

const InternshipHistory = () => {
  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD HISTORY
  // ==========================================

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getInternshipHistory();

        setHistory(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Internship history error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internship history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);


  // ==========================================
  // STATISTICS
  // ==========================================

  const completedCount =
    history.filter(
      (item) =>
        item.internshipId?.status ===
        "completed"
    ).length;

  const rejectedCount =
    history.filter(
      (item) =>
        item.status === "rejected"
    ).length;

  const archivedCount =
    history.filter(
      (item) =>
        item.internshipId?.status ===
        "archived"
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Internship History
        </h1>

        <p className="mt-1 text-slate-500">
          View your previous internship
          applications and completed
          internships.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* STATISTICS */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <HistoryStatCard
            title="Completed"
            value={completedCount}
          />

          <HistoryStatCard
            title="Rejected"
            value={rejectedCount}
          />

          <HistoryStatCard
            title="Archived"
            value={archivedCount}
          />

        </div>
      )}


      {/* CONTENT */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No internship history yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Completed, rejected, or archived
            internships will appear here.
          </p>

          <Link
            to="/student/internships"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Browse Internships
          </Link>

        </div>
      ) : (
        <div className="space-y-5">

          {history.map(
            (application) => (
              <HistoryCard
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


// ==========================================
// HISTORY CARD
// ==========================================

const HistoryCard = ({
  application,
}) => {
  const internship =
    application.internshipId;

  const company =
    application.companyId ||
    internship?.companyId;

  const internshipStatus =
    internship?.status;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            {internship?.title ||
              "Internship"}
          </h2>

          <p className="mt-1 font-medium text-blue-600">
            {company?.companyName ||
              "Company"}
          </p>

        </div>


        <div className="flex flex-wrap gap-2">

          <StatusBadge
            status={
              application.status
            }
          />

          {internshipStatus && (
            <StatusBadge
              status={
                internshipStatus
              }
            />
          )}

        </div>

      </div>


      {/* DETAILS */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <HistoryInfo
          label="Location"
          value={
            internship?.location
          }
        />

        <HistoryInfo
          label="Work Mode"
          value={
            internship?.workMode
          }
        />

        <HistoryInfo
          label="Duration"
          value={
            internship?.duration
          }
        />

        <HistoryInfo
          label="Stipend"
          value={
            internship?.stipend
          }
        />

      </div>


      <div className="mt-5 border-t border-slate-200 pt-5">

        <div className="grid gap-4 sm:grid-cols-3">

          <HistoryInfo
            label="Applied On"
            value={formatDate(
              application.appliedAt ||
                application.createdAt
            )}
          />

          <HistoryInfo
            label="Joining Date"
            value={formatDate(
              application.selection
                ?.joiningDate
            )}
          />

          <HistoryInfo
            label="Application Status"
            value={
              application.status?.replaceAll(
                "_",
                " "
              )
            }
          />

        </div>

      </div>


      {/* REJECTED */}

      {application.status ===
        "rejected" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            Application Rejected
          </p>

          {application.rejectionReason && (
            <p className="mt-1 text-sm text-red-600">
              {
                application.rejectionReason
              }
            </p>
          )}

        </div>
      )}


      {/* COMPLETED */}

      {internshipStatus ===
        "completed" && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-700">
            Internship Completed
          </p>

          <p className="mt-1 text-sm text-green-600">
            This internship has been
            successfully completed.
          </p>

        </div>
      )}


      <div className="mt-5">

        <Link
          to={`/student/applications/${application._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Application Details →
        </Link>

      </div>

    </div>
  );
};


// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({
  status,
}) => {
  const normalized =
    status || "unknown";

  const styles = {
    applied:
      "bg-blue-50 text-blue-700",

    under_review:
      "bg-yellow-50 text-yellow-700",

    shortlisted:
      "bg-purple-50 text-purple-700",

    interview_scheduled:
      "bg-indigo-50 text-indigo-700",

    selected:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",

    completed:
      "bg-green-50 text-green-700",

    archived:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[normalized] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {normalized.replaceAll(
        "_",
        " "
      )}
    </span>
  );
};


// ==========================================
// INFO
// ==========================================

const HistoryInfo = ({
  label,
  value,
}) => {
  return (
    <div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium capitalize text-slate-800">
        {value || "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const HistoryStatCard = ({
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
// DATE
// ==========================================

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString();
};


export default InternshipHistory;