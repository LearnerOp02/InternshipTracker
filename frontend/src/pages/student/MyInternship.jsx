import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getSelectedApplication,
} from "../../services/applicationService";

import {
  getMyInternshipProgress,
} from "../../services/progressService";

const MyInternship = () => {
  const [application, setApplication] =
    useState(null);

  const [progress, setProgress] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInternship = async () => {
      try {
        setLoading(true);
        setError("");

        const selectedApplication =
          await getSelectedApplication();

        if (!selectedApplication) {
          setApplication(null);
          return;
        }

        setApplication(
          selectedApplication
        );

        const internshipId =
          selectedApplication
            .internshipId?._id ||
          selectedApplication
            .internshipId;

        if (internshipId) {
          try {
            const progressResponse =
              await getMyInternshipProgress(
                internshipId
              );

            const progressData =
              progressResponse.progress ||
              progressResponse.data ||
              progressResponse;

            setProgress(progressData);
          } catch (progressError) {
            console.error(
              "Progress error:",
              progressError
            );

            setProgress(null);
          }
        }
      } catch (error) {
        console.error(
          "My internship error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internship"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInternship();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading internship...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!application) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            My Internship
          </h1>

          <p className="mt-1 text-slate-500">
            View your active internship and progress.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No active internship
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You do not currently have a selected internship.
          </p>

          <Link
            to="/student/internships"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Browse Internships
          </Link>

        </div>
      </div>
    );
  }

  const internship =
    application.internshipId;

  const company =
    application.companyId ||
    internship?.companyId;

  const progressPercentage =
    progress?.percentage ??
    progress?.progressPercentage ??
    0;

  const progressStatus =
    progress?.status ||
    "not_started";

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          My Internship
        </h1>

        <p className="mt-1 text-slate-500">
          Track your internship details and progress.
        </p>
      </div>


      {/* MAIN INTERNSHIP CARD */}

      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-start">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              {internship?.title ||
                "Internship"}
            </h2>

            <p className="mt-2 font-medium text-blue-600">
              {company?.companyName ||
                "Company"}
            </p>

          </div>

          <span className="self-start rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Selected
          </span>

        </div>


        {/* DETAILS */}

        <div className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">

          <Info
            label="Location"
            value={internship?.location}
          />

          <Info
            label="Work Mode"
            value={internship?.workMode}
          />

          <Info
            label="Duration"
            value={internship?.duration}
          />

          <Info
            label="Stipend"
            value={internship?.stipend}
          />

        </div>


        {/* PROGRESS */}

        <div className="border-t border-slate-200 pt-6">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Internship Progress
              </h3>

              <p className="mt-1 text-sm capitalize text-slate-500">
                Status:{" "}
                {progressStatus.replaceAll(
                  "_",
                  " "
                )}
              </p>
            </div>

            <p className="text-2xl font-bold text-blue-600">
              {progressPercentage}%
            </p>

          </div>


          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(
                  progressPercentage,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

      </div>


      {/* SECONDARY CARDS */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">


        {/* TASKS */}

        <Link
          to="/student/tasks"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >

          <h3 className="text-lg font-semibold text-slate-900">
            Tasks
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            View assigned internship tasks and update their progress.
          </p>

          <p className="mt-4 text-sm font-medium text-blue-600">
            View Tasks →
          </p>

        </Link>


        {/* WEEKLY REPORTS */}

        <Link
          to="/student/weekly-reports"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >

          <h3 className="text-lg font-semibold text-slate-900">
            Weekly Reports
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Submit and track your weekly internship reports.
          </p>

          <p className="mt-4 text-sm font-medium text-blue-600">
            View Reports →
          </p>

        </Link>


        {/* DOCUMENTS */}

        <Link
          to="/student/documents"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >

          <h3 className="text-lg font-semibold text-slate-900">
            Documents
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Manage internship-related documents.
          </p>

          <p className="mt-4 text-sm font-medium text-blue-600">
            View Documents →
          </p>

        </Link>

      </div>


      {/* SELECTION INFORMATION */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold">
          Selection Information
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">

          <Info
            label="Application Status"
            value={
              application.status?.replaceAll(
                "_",
                " "
              )
            }
          />

          <Info
            label="Applied On"
            value={formatDate(
              application.appliedAt
            )}
          />

          <Info
            label="Joining Date"
            value={formatDate(
              application.selection
                ?.joiningDate
            )}
          />

          <Info
            label="Internship Status"
            value={
              progressStatus.replaceAll(
                "_",
                " "
              )
            }
          />

        </div>

      </div>

    </div>
  );
};


const Info = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium capitalize text-slate-800">
        {value || "N/A"}
      </p>

    </div>
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

export default MyInternship;