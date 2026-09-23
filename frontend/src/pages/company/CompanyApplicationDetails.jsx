/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCompanyApplicationById,
  updateApplicationStatus,
  selectStudent,
} from "../../services/applicationService";


const CompanyApplicationDetails = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD APPLICATION
  // ==========================================

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCompanyApplicationById(
          id
        );

      const applicationData =
        data.application ||
        data.data ||
        data;

      setApplication(
        applicationData
      );

    } catch (error) {
      console.error(
        "Application details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load application details"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadApplication();
  }, [id]);


  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const handleStatusUpdate = async (
    status
  ) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await updateApplicationStatus(
        id,
        status
      );

      setApplication(
        (previous) => ({
          ...previous,
          status,
        })
      );

      setSuccess(
        `Application status updated to ${status.replaceAll(
          "_",
          " "
        )}.`
      );

    } catch (error) {
      console.error(
        "Application update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update application status"
      );
    } finally {
      setUpdating(false);
    }
  };


  // ==========================================
  // SELECT STUDENT
  // ==========================================

  const handleSelectStudent = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await selectStudent(
        id
      );

      setApplication(
        (previous) => ({
          ...previous,
          status: "selected",
        })
      );

      setSuccess(
        "Student selected successfully."
      );

    } catch (error) {
      console.error(
        "Student selection error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to select student"
      );
    } finally {
      setUpdating(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading application...
      </div>
    );
  }


  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!application) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-900">
          Application not found
        </h2>

        <Link
          to="/company/applicants"
          className="mt-4 inline-block text-blue-600"
        >
          ← Back to applicants
        </Link>

      </div>
    );
  }


  const student =
    application.studentId ||
    application.student ||
    {};

  const user =
    student.userId ||
    student.user ||
    {};

  const internship =
    application.internshipId ||
    application.internship ||
    {};

  const interview =
    application.interview ||
    {};


  return (
    <div>

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/company/applicants"
              )
            }
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Applicants
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Application Details
          </h1>

          <p className="mt-1 text-slate-500">
            Review the student's application.
          </p>

        </div>


        <StatusBadge
          status={
            application.status
          }
        />

      </div>


      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ====================================== */}
      {/* SUCCESS */}
      {/* ====================================== */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* ====================================== */}
      {/* STUDENT INFORMATION */}
      {/* ====================================== */}

      <Section
        title="Student Information"
      >

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <Info
            label="Name"
            value={
              student.name ||
              user.name
            }
          />

          <Info
            label="Email"
            value={
              student.email ||
              user.email
            }
          />

          <Info
            label="Phone"
            value={
              student.phone
            }
          />

          <Info
            label="Enrollment Number"
            value={
              student.enrollmentNumber ||
              student.rollNumber
            }
          />

          <Info
            label="Branch"
            value={
              student.branch
            }
          />

          <Info
            label="Year"
            value={
              student.year
            }
          />

          <Info
            label="CGPA"
            value={
              student.cgpa
            }
          />

          <Info
            label="Backlogs"
            value={
              student.backlogs
            }
          />

        </div>


        {/* SKILLS */}

        {Array.isArray(
          student.skills
        ) &&
          student.skills.length > 0 && (
            <div className="mt-6">

              <p className="mb-2 text-sm font-medium text-slate-700">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">

                {student.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

      </Section>


      {/* ====================================== */}
      {/* INTERNSHIP DETAILS */}
      {/* ====================================== */}

      <Section
        title="Internship Applied For"
      >

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <Info
            label="Title"
            value={
              internship.title
            }
          />

          <Info
            label="Location"
            value={
              internship.location
            }
          />

          <Info
            label="Work Mode"
            value={
              internship.workMode
            }
          />

          <Info
            label="Duration"
            value={
              internship.duration
            }
          />

          <Info
            label="Stipend"
            value={
              internship.stipend
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

      </Section>


      {/* ====================================== */}
      {/* APPLICATION INFORMATION */}
      {/* ====================================== */}

      <Section
        title="Application Information"
      >

        <div className="grid gap-5 sm:grid-cols-2">

          <Info
            label="Current Status"
            value={
              application.status?.replaceAll(
                "_",
                " "
              )
            }
          />

          <Info
            label="Application Date"
            value={formatDate(
              application.appliedAt ||
                application.createdAt
            )}
          />

        </div>


        {/* COVER LETTER */}

        {application.coverLetter && (
          <div className="mt-6">

            <p className="text-sm font-medium text-slate-700">
              Cover Letter
            </p>

            <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {
                application.coverLetter
              }
            </div>

          </div>
        )}


        {/* RESUME */}

        {application.resumeUrl && (
          <div className="mt-6">

            <a
              href={
                application.resumeUrl
              }
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              View Resume
            </a>

          </div>
        )}

      </Section>


      {/* ====================================== */}
      {/* INTERVIEW DETAILS */}
      {/* ====================================== */}

      {(
        application.interview ||
        application.status ===
          "interview_scheduled"
      ) && (
        <Section
          title="Interview Details"
        >

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Info
              label="Date"
              value={formatDate(
                interview.interviewDate ||
                  interview.date
              )}
            />

            <Info
              label="Time"
              value={
                interview.interviewTime ||
                interview.time
              }
            />

            <Info
              label="Mode"
              value={
                interview.mode
              }
            />

            <Info
              label="Location"
              value={
                interview.location
              }
            />

          </div>


          {/* MEETING LINK */}

          {interview.meetingLink && (
            <div className="mt-5">

              <a
                href={
                  interview.meetingLink
                }
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Open Meeting Link
              </a>

            </div>
          )}


          {/* INTERVIEW NOTES */}

          {interview.notes && (
            <div className="mt-5">

              <p className="text-sm font-medium text-slate-700">
                Interview Notes
              </p>

              <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {
                  interview.notes
                }
              </div>

            </div>
          )}

        </Section>
      )}


      {/* ====================================== */}
      {/* APPLICATION ACTIONS */}
      {/* ====================================== */}

      <Section
        title="Application Actions"
      >

        <div className="flex flex-wrap gap-3">

          {/* MARK UNDER REVIEW */}

          {application.status ===
            "applied" && (
            <button
              type="button"
              onClick={() =>
                handleStatusUpdate(
                  "under_review"
                )
              }
              disabled={updating}
              className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating
                ? "Updating..."
                : "Mark Under Review"}
            </button>
          )}


          {/* SHORTLIST */}

          {[
            "applied",
            "under_review",
          ].includes(
            application.status
          ) && (
            <button
              type="button"
              onClick={() =>
                handleStatusUpdate(
                  "shortlisted"
                )
              }
              disabled={updating}
              className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Shortlist Student
            </button>
          )}


          {/* SCHEDULE INTERVIEW */}

          {application.status ===
            "shortlisted" && (
            <Link
              to={`/company/applications/${application._id}/interview`}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              Schedule Interview
            </Link>
          )}


          {/* GENERAL REJECT */}

          {[
            "applied",
            "under_review",
            "shortlisted",
          ].includes(
            application.status
          ) && (
            <button
              type="button"
              onClick={() =>
                handleStatusUpdate(
                  "rejected"
                )
              }
              disabled={updating}
              className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
          )}

        </div>


        {/* ================================== */}
        {/* AFTER INTERVIEW */}
        {/* ================================== */}

        {application.status ===
          "interview_scheduled" && (
          <div className="mt-5">

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
              Interview has been scheduled for this applicant.
              After completing the interview, select or reject
              the student.
            </div>


            <div className="mt-4 flex flex-wrap gap-3">

              {/* SELECT STUDENT */}

              <button
                type="button"
                onClick={
                  handleSelectStudent
                }
                disabled={updating}
                className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating
                  ? "Processing..."
                  : "Select Student"}
              </button>


              {/* REJECT AFTER INTERVIEW */}

              <button
                type="button"
                onClick={() =>
                  handleStatusUpdate(
                    "rejected"
                  )
                }
                disabled={updating}
                className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject After Interview
              </button>

            </div>

          </div>
        )}


        {/* ================================== */}
        {/* SELECTED */}
        {/* ================================== */}

        {application.status ===
          "selected" && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

            <p className="font-medium text-green-800">
              Student Selected
            </p>

            <p className="mt-1 text-sm text-green-700">
              This student has been selected for
              the internship.
            </p>

          </div>
        )}


        {/* ================================== */}
        {/* REJECTED */}
        {/* ================================== */}

        {application.status ===
          "rejected" && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="font-medium text-red-800">
              Application Rejected
            </p>

            <p className="mt-1 text-sm text-red-700">
              This application has been rejected.
            </p>

          </div>
        )}

      </Section>

    </div>
  );
};


// ==========================================
// SECTION
// ==========================================

const Section = ({
  title,
  children,
}) => (
  <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-xl font-semibold text-slate-900">
      {title}
    </h2>

    {children}

  </div>
);


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
      {value !== undefined &&
      value !== null &&
      value !== ""
        ? value
        : "N/A"}
    </p>

  </div>
);


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
      className={`self-start rounded-full px-4 py-2 text-sm font-medium capitalize ${
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
// DATE
// ==========================================

const formatDate = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


export default CompanyApplicationDetails;