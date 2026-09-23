import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getCompanyInternships,
} from "../../services/internshipService";

const CompanyInternships = () => {
  const [internships, setInternships] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD INTERNSHIPS
  // ==========================================

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCompanyInternships();

        const internshipList =
          data.internships ||
          data.data ||
          data ||
          [];

        setInternships(
          Array.isArray(internshipList)
            ? internshipList
            : []
        );
      } catch (error) {
        console.error(
          "Company internships error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internships"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);


  // ==========================================
  // STATISTICS
  // ==========================================

  const total =
    internships.length;

  const draft =
    internships.filter(
      (item) =>
        item.status === "draft"
    ).length;

  const pending =
    internships.filter(
      (item) =>
        item.status ===
        "pending_approval"
    ).length;

  const published =
    internships.filter(
      (item) =>
        item.status === "published"
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            My Internships
          </h1>

          <p className="mt-1 text-slate-500">
            Manage internships created by
            your company.
          </p>

        </div>


        <Link
          to="/company/internships/create"
          className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
        >
          + Create Internship
        </Link>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* STATISTICS */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <InternshipStatCard
            title="Total"
            value={total}
          />

          <InternshipStatCard
            title="Draft"
            value={draft}
          />

          <InternshipStatCard
            title="Pending Approval"
            value={pending}
          />

          <InternshipStatCard
            title="Published"
            value={published}
          />

        </div>
      )}


      {/* CONTENT */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading internships...
        </div>
      ) : internships.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No internships created
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create your first internship
            opportunity.
          </p>

          <Link
            to="/company/internships/create"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Create Internship
          </Link>

        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">

          {internships.map(
            (internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
              />
            )
          )}

        </div>
      )}

    </div>
  );
};


// ==========================================
// INTERNSHIP CARD
// ==========================================

const InternshipCard = ({
  internship,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            {internship.title ||
              "Internship"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {internship.location ||
              "Location not specified"}
          </p>

        </div>


        <StatusBadge
          status={
            internship.status
          }
        />

      </div>


      {/* DESCRIPTION */}

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {internship.description ||
          "No description provided."}
      </p>


      {/* INFORMATION */}

      <div className="mt-5 grid grid-cols-2 gap-4">

        <InternshipInfo
          label="Work Mode"
          value={
            internship.workMode
          }
        />

        <InternshipInfo
          label="Duration"
          value={
            internship.duration
          }
        />

        <InternshipInfo
          label="Stipend"
          value={
            internship.stipend
          }
        />

        <InternshipInfo
          label="Openings"
          value={
            internship.openings
          }
        />

      </div>


      {/* APPLICATION DEADLINE */}

      <div className="mt-5 border-t border-slate-200 pt-4">

        <p className="text-xs text-slate-500">
          Application Deadline
        </p>

        <p className="mt-1 text-sm font-medium text-slate-800">
          {formatDate(
            internship.applicationDeadline ||
              internship.deadline
          )}
        </p>

      </div>


      {/* ACTION */}

      <div className="mt-5">

        <Link
          to={`/company/internships/${internship._id}`}
          className="inline-block rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          View Details
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
    status || "draft";

  const styles = {
    draft:
      "bg-slate-100 text-slate-700",

    pending_approval:
      "bg-yellow-50 text-yellow-700",

    approved:
      "bg-green-50 text-green-700",

    published:
      "bg-blue-50 text-blue-700",

    application_closed:
      "bg-orange-50 text-orange-700",

    ongoing:
      "bg-purple-50 text-purple-700",

    completed:
      "bg-green-50 text-green-700",

    archived:
      "bg-slate-200 text-slate-700",

    rejected:
      "bg-red-50 text-red-700",
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

const InternshipInfo = ({
  label,
  value,
}) => {
  return (
    <div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium capitalize text-slate-800">
        {value ?? "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const InternshipStatCard = ({
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

const formatDate = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString();
};


export default CompanyInternships;