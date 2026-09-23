import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getMyApplicationById,
} from "../../services/applicationService";


const ApplicationDetails = () => {
  const { id } = useParams();

  const [application, setApplication] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadApplication =
      async () => {
        try {
          setLoading(true);

          const data =
            await getMyApplicationById(
              id
            );

          setApplication(
            data.application ||
              data.data ||
              data
          );
        } catch (error) {
          console.error(
            "Application details error:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              "Failed to load application"
          );
        } finally {
          setLoading(false);
        }
      };

    loadApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Loading application...
      </div>
    );
  }

  if (
    error ||
    !application
  ) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">
        {error ||
          "Application not found"}
      </div>
    );
  }

  const internship =
    application.internshipId;

  const company =
    application.companyId;

  return (
    <div className="mx-auto max-w-5xl">

      <Link
        to="/student/applications"
        className="mb-5 inline-block text-sm font-medium text-blue-600"
      >
        ← Back to My Applications
      </Link>


      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              {internship?.title ||
                "Internship Application"}
            </h1>

            <p className="mt-2 font-medium text-blue-600">
              {company?.companyName ||
                "Company"}
            </p>

          </div>

          <StatusBadge
            status={
              application.status
            }
          />

        </div>


        {/* APPLICATION */}

        <section className="py-6">

          <h2 className="text-xl font-semibold">
            Application Information
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <Info
              label="Application Status"
              value={application.status?.replaceAll(
                "_",
                " "
              )}
            />

            <Info
              label="Applied On"
              value={formatDate(
                application.appliedAt
              )}
            />

            <Info
              label="Location"
              value={
                internship?.location
              }
            />

            <Info
              label="Work Mode"
              value={
                internship?.workMode
              }
            />

            <Info
              label="Duration"
              value={
                internship?.duration
              }
            />

            <Info
              label="Stipend"
              value={
                internship?.stipend
              }
            />

          </div>

        </section>


        {/* INTERVIEW */}

        {application.interview
          ?.scheduledAt && (
          <section className="border-t border-slate-200 py-6">

            <h2 className="text-xl font-semibold">
              Interview Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <Info
                label="Interview Date"
                value={formatDateTime(
                  application
                    .interview
                    .scheduledAt
                )}
              />

              <Info
                label="Mode"
                value={
                  application
                    .interview.mode
                }
              />

              {application
                .interview
                .meetingLink && (
                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">
                    Meeting Link
                  </p>

                  <a
                    href={
                      application
                        .interview
                        .meetingLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all font-medium text-blue-600"
                  >
                    Join Interview
                  </a>

                </div>
              )}

              {application
                .interview
                .location && (
                <Info
                  label="Interview Location"
                  value={
                    application
                      .interview
                      .location
                  }
                />
              )}

              {application
                .interview
                .notes && (
                <Info
                  label="Notes"
                  value={
                    application
                      .interview
                      .notes
                  }
                />
              )}

            </div>

          </section>
        )}


        {/* SELECTION */}

        {application.status ===
          "selected" && (
          <section className="border-t border-slate-200 pt-6">

            <div className="rounded-xl border border-green-200 bg-green-50 p-5">

              <h2 className="text-lg font-semibold text-green-700">
                Congratulations! You
                have been selected.
              </h2>

              {application.selection
                ?.joiningDate && (
                <p className="mt-2 text-sm text-green-700">
                  Joining Date:{" "}
                  {formatDate(
                    application
                      .selection
                      .joiningDate
                  )}
                </p>
              )}

              {application.selection
                ?.offerLetterUrl && (
                <a
                  href={
                    application
                      .selection
                      .offerLetterUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-green-700 underline"
                >
                  View Offer Letter
                </a>
              )}

            </div>

          </section>
        )}


        {/* REJECTED */}

        {application.status ===
          "rejected" && (
          <section className="border-t border-slate-200 pt-6">

            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              This application was not
              selected.
            </div>

          </section>
        )}

      </div>

    </div>
  );
};


const Info = ({
  label,
  value,
}) => (
  <div className="rounded-xl bg-slate-50 p-4">

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-medium capitalize text-slate-800">
      {value || "N/A"}
    </p>

  </div>
);


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
      className={`self-start rounded-full px-4 py-2 text-sm font-medium capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status?.replaceAll(
        "_",
        " "
      )}
    </span>
  );
};


const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(
    date
  ).toLocaleDateString();
};


const formatDateTime = (date) => {
  if (!date) return "N/A";

  return new Date(
    date
  ).toLocaleString();
};

export default ApplicationDetails;