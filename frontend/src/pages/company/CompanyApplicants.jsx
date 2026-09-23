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

import {
  getCompanyApplicants,
  updateApplicationStatus,
} from "../../services/applicationService";


const CompanyApplicants = () => {
  const [internships, setInternships] =
    useState([]);

  const [selectedInternship, setSelectedInternship] =
    useState("");

  const [applications, setApplications] =
    useState([]);

  const [loadingInternships, setLoadingInternships] =
    useState(true);

  const [loadingApplications, setLoadingApplications] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD COMPANY INTERNSHIPS
  // ==========================================

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoadingInternships(true);
        setError("");

        const data =
          await getCompanyInternships();

        const internshipList =
          data.internships ||
          data.data ||
          data ||
          [];

        const safeList =
          Array.isArray(internshipList)
            ? internshipList
            : [];

        setInternships(safeList);

        if (safeList.length > 0) {
          setSelectedInternship(
            safeList[0]._id
          );
        }

      } catch (error) {
        console.error(
          "Load company internships error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internships"
        );
      } finally {
        setLoadingInternships(false);
      }
    };

    loadInternships();
  }, []);


  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  useEffect(() => {
    if (!selectedInternship) {
      return;
    }

    const loadApplications = async () => {
      try {
        setLoadingApplications(true);
        setError("");

        const data =
          await getCompanyApplicants(
            selectedInternship
          );

        const applicationList =
          data.applications ||
          data.data ||
          data ||
          [];

        setApplications(
          Array.isArray(applicationList)
            ? applicationList
            : []
        );

      } catch (error) {
        console.error(
          "Load applicants error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load applicants"
        );

        setApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };

    loadApplications();
  }, [selectedInternship]);


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusUpdate = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");
      setSuccess("");

      await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications(
        (previous) =>
          previous.map(
            (application) =>
              application._id ===
              applicationId
                ? {
                    ...application,
                    status,
                  }
                : application
          )
      );

      setSuccess(
        `Application status changed to ${status.replaceAll(
          "_",
          " "
        )}.`
      );

    } catch (error) {
      console.error(
        "Application status update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update application status"
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // STATS
  // ==========================================

  const total =
    applications.length;

  const underReview =
    applications.filter(
      (item) =>
        item.status === "under_review"
    ).length;

  const shortlisted =
    applications.filter(
      (item) =>
        item.status === "shortlisted"
    ).length;

  const selected =
    applications.filter(
      (item) =>
        item.status === "selected"
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Applicants
        </h1>

        <p className="mt-1 text-slate-500">
          Review students who have applied
          for your internships.
        </p>

      </div>


      {/* SELECT INTERNSHIP */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Select Internship
        </label>

        {loadingInternships ? (
          <p className="text-sm text-slate-500">
            Loading internships...
          </p>
        ) : internships.length === 0 ? (
          <div>

            <p className="text-sm text-slate-500">
              You have not created any
              internships yet.
            </p>

            <Link
              to="/company/internships/create"
              className="mt-3 inline-block text-sm font-medium text-blue-600"
            >
              Create Internship →
            </Link>

          </div>
        ) : (
          <select
            value={selectedInternship}
            onChange={(event) =>
              setSelectedInternship(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-xl"
          >
            {internships.map(
              (internship) => (
                <option
                  key={internship._id}
                  value={internship._id}
                >
                  {internship.title}
                  {" — "}
                  {internship.status?.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>
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

      {selectedInternship &&
        !loadingApplications && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Total Applicants"
              value={total}
            />

            <StatCard
              title="Under Review"
              value={underReview}
            />

            <StatCard
              title="Shortlisted"
              value={shortlisted}
            />

            <StatCard
              title="Selected"
              value={selected}
            />

          </div>
        )}


      {/* APPLICANTS */}

      {!selectedInternship ? null : loadingApplications ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading applicants...
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No applicants yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Student applications for this
            internship will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {applications.map(
            (application) => (
              <ApplicantCard
                key={application._id}
                application={
                  application
                }
                updating={
                  updatingId ===
                  application._id
                }
                onStatusUpdate={
                  handleStatusUpdate
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
// APPLICANT CARD
// ==========================================

const ApplicantCard = ({
  application,
  updating,
  onStatusUpdate,
}) => {
  const student =
    application.studentId ||
    application.student;

  const user =
    student?.userId ||
    student?.user ||
    {};

  const studentName =
    student?.name ||
    user?.name ||
    application.studentName ||
    "Student";

  const email =
    student?.email ||
    user?.email ||
    application.email ||
    "N/A";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

        {/* STUDENT */}

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-xl font-semibold text-slate-900">
              {studentName}
            </h2>

            <StatusBadge
              status={
                application.status
              }
            />

          </div>


          <p className="mt-1 text-sm text-slate-500">
            {email}
          </p>

        </div>


        {/* DETAILS LINK */}

        <Link
          to={`/company/applications/${application._id}`}
          className="self-start rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View Application
        </Link>

      </div>


      {/* STUDENT INFORMATION */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Info
          label="Branch"
          value={
            student?.branch ||
            application.branch
          }
        />

        <Info
          label="Year"
          value={
            student?.year ||
            application.year
          }
        />

        <Info
          label="CGPA"
          value={
            student?.cgpa ??
            application.cgpa
          }
        />

        <Info
          label="Applied On"
          value={formatDate(
            application.appliedAt ||
              application.createdAt
          )}
        />

      </div>


      {/* SKILLS */}

      {Array.isArray(
        student?.skills
      ) &&
        student.skills.length > 0 && (
          <div className="mt-5">

            <p className="mb-2 text-xs font-medium text-slate-500">
              Skills
            </p>

            <div className="flex flex-wrap gap-2">

              {student.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </div>
        )}


      {/* ACTIONS */}

      <div className="mt-6 border-t border-slate-200 pt-5">

        <p className="mb-3 text-sm font-medium text-slate-700">
          Application Actions
        </p>

        <div className="flex flex-wrap gap-3">

          {application.status ===
            "applied" && (
            <button
              onClick={() =>
                onStatusUpdate(
                  application._id,
                  "under_review"
                )
              }
              disabled={updating}
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-60"
            >
              Mark Under Review
            </button>
          )}


          {[
            "applied",
            "under_review",
          ].includes(
            application.status
          ) && (
            <button
              onClick={() =>
                onStatusUpdate(
                  application._id,
                  "shortlisted"
                )
              }
              disabled={updating}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              Shortlist
            </button>
          )}


          {![
            "selected",
            "rejected",
          ].includes(
            application.status
          ) && (
            <button
              onClick={() =>
                onStatusUpdate(
                  application._id,
                  "rejected"
                )
              }
              disabled={updating}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              Reject
            </button>
          )}

        </div>

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
    status || "applied";

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

const Info = ({
  label,
  value,
}) => (
  <div>

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-medium capitalize text-slate-800">
      {value ?? "N/A"}
    </p>

  </div>
);


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


export default CompanyApplicants;