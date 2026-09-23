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
} from "../../services/applicationService";


const CompanyInterviews = () => {
  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const internshipData =
          await getCompanyInternships();

        const internships =
          internshipData.internships ||
          internshipData.data ||
          internshipData ||
          [];

        if (
          !Array.isArray(internships)
        ) {
          setInterviews([]);
          return;
        }

        const allApplications =
          [];

        for (
          const internship of internships
        ) {
          try {
            const data =
              await getCompanyApplicants(
                internship._id
              );

            const applications =
              data.applications ||
              data.data ||
              data ||
              [];

            if (
              Array.isArray(
                applications
              )
            ) {
              applications.forEach(
                (application) => {
                  if (
                    application.status ===
                      "interview_scheduled" ||
                    application.interview
                  ) {
                    allApplications.push({
                      ...application,
                      internshipData:
                        internship,
                    });
                  }
                }
              );
            }

          } catch (error) {
            console.error(
              `Failed loading applicants for ${internship._id}`,
              error
            );
          }
        }

        setInterviews(
          allApplications
        );

      } catch (error) {
        console.error(
          "Interview load error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load interviews"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);


  return (
    <div>

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Interviews
        </h1>

        <p className="mt-1 text-slate-500">
          View and manage scheduled
          student interviews.
        </p>

      </div>


      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading interviews...
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No interviews scheduled
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Shortlist students and schedule
            interviews to see them here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {interviews.map(
            (application) => (
              <InterviewCard
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


const InterviewCard = ({
  application,
}) => {
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
    application.internshipData ||
    {};

  const interview =
    application.interview ||
    {};


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-5 lg:flex-row">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            {student.name ||
              user.name ||
              "Student"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {internship.title ||
              "Internship"}
          </p>

        </div>


        <span className="self-start rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Interview Scheduled
        </span>

      </div>


      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

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
          label="Email"
          value={
            student.email ||
            user.email
          }
        />

      </div>


      <div className="mt-5 flex flex-wrap gap-3">

        <Link
          to={`/company/applications/${application._id}`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View Application
        </Link>


        {interview.meetingLink && (
          <a
            href={
              interview.meetingLink
            }
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Join Meeting
          </a>
        )}

      </div>

    </div>
  );
};


const Info = ({
  label,
  value,
}) => (
  <div>

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-medium capitalize text-slate-800">
      {value || "N/A"}
    </p>

  </div>
);


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


export default CompanyInterviews;