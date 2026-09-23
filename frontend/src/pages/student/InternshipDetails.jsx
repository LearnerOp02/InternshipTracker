import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  checkInternshipEligibility,
  getInternshipById,
} from "../../services/internshipService";

const InternshipDetails = () => {
  const { id } = useParams();

  const [internship, setInternship] =
    useState(null);

  const [eligibility, setEligibility] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [eligibilityLoading, setEligibilityLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const internshipData =
          await getInternshipById(id);

        const internshipRecord =
          internshipData.internship ||
          internshipData.data ||
          internshipData;

        setInternship(internshipRecord);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load internship"
        );
      } finally {
        setLoading(false);
      }
    };

    const loadEligibility = async () => {
      try {
        setEligibilityLoading(true);

        const data =
          await checkInternshipEligibility(id);

        setEligibility(
          data.eligibility ||
            data.data ||
            data
        );
      } catch (error) {
        console.error(
          "Eligibility error:",
          error
        );

        setEligibility({
          eligible: false,
          reasons: [
            error.response?.data?.message ||
              "Unable to check eligibility",
          ],
        });
      } finally {
        setEligibilityLoading(false);
      }
    };

    loadData();
    loadEligibility();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Loading internship...
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">
        {error || "Internship not found"}
      </div>
    );
  }

  const companyName =
    internship.companyId?.companyName ||
    "Company";

  return (
    <div className="mx-auto max-w-5xl">

      <Link
        to="/student/internships"
        className="mb-5 inline-block text-sm font-medium text-blue-600"
      >
        ← Back to Internships
      </Link>


      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="border-b border-slate-200 pb-6">

          <h1 className="text-3xl font-bold text-slate-900">
            {internship.title}
          </h1>

          <p className="mt-2 text-lg font-medium text-blue-600">
            {companyName}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            <Badge
              text={internship.workMode}
            />

            <Badge
              text={internship.location}
            />

            <Badge
              text={internship.status}
            />

          </div>

        </div>


        {/* DESCRIPTION */}

        <section className="py-6">

          <h2 className="text-xl font-semibold">
            Internship Description
          </h2>

          <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
            {internship.description ||
              "No description available."}
          </p>

        </section>


        {/* INFORMATION */}

        <section className="border-t border-slate-200 py-6">

          <h2 className="text-xl font-semibold">
            Internship Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <Info
              label="Duration"
              value={internship.duration}
            />

            <Info
              label="Stipend"
              value={internship.stipend}
            />

            <Info
              label="Openings"
              value={internship.openings}
            />

            <Info
              label="Start Date"
              value={formatDate(
                internship.startDate
              )}
            />

            <Info
              label="End Date"
              value={formatDate(
                internship.endDate
              )}
            />

            <Info
              label="Application Deadline"
              value={formatDate(
                internship.applicationDeadline
              )}
            />

          </div>

        </section>


        {/* REQUIRED SKILLS */}

        <section className="border-t border-slate-200 py-6">

          <h2 className="text-xl font-semibold">
            Required Skills
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {internship.requiredSkills
              ?.length ? (
              internship.requiredSkills.map(
                (skill) => (
                  <Badge
                    key={skill}
                    text={skill}
                  />
                )
              )
            ) : (
              <p className="text-sm text-slate-500">
                No specific skills listed.
              </p>
            )}

          </div>

        </section>


        {/* ELIGIBILITY REQUIREMENTS */}

        <section className="border-t border-slate-200 py-6">

          <h2 className="text-xl font-semibold">
            Eligibility Requirements
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <Info
              label="Minimum CGPA"
              value={
                internship.eligibility
                  ?.minimumCGPA ?? "N/A"
              }
            />

            <Info
              label="Maximum Backlogs"
              value={
                internship.eligibility
                  ?.maximumBacklogs ?? "N/A"
              }
            />

            <Info
              label="Eligible Years"
              value={
                internship.eligibility
                  ?.eligibleYears?.join(
                    ", "
                  ) || "All"
              }
            />

            <Info
              label="Eligible Branches"
              value={
                internship.eligibility
                  ?.branches?.join(", ") ||
                "All"
              }
            />

          </div>

        </section>


        {/* STUDENT ELIGIBILITY */}

        <section className="border-t border-slate-200 pt-6">

          <h2 className="text-xl font-semibold">
            Your Eligibility
          </h2>

          {eligibilityLoading ? (
            <p className="mt-4 text-slate-500">
              Checking eligibility...
            </p>
          ) : eligibility?.eligible ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">

              <p className="font-semibold text-green-700">
                ✓ You are eligible for this internship
              </p>

              <p className="mt-1 text-sm text-green-600">
                You meet the internship requirements.
              </p>

            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5">

              <p className="font-semibold text-red-700">
                You are currently not eligible
              </p>

              {eligibility?.reasons?.length >
                0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-600">

                  {eligibility.reasons.map(
                    (reason, index) => (
                      <li key={index}>
                        {reason}
                      </li>
                    )
                  )}

                </ul>
              )}

              {eligibility?.missingSkills
                ?.length > 0 && (
                <div className="mt-4">

                  <p className="text-sm font-medium text-red-700">
                    Missing Skills
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {eligibility.missingSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>
          )}


          <div className="mt-6">

            {eligibility?.eligible ? (
              <Link
                to={`/student/internships/${id}/apply`}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Apply for Internship
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg bg-slate-300 px-6 py-3 font-medium text-white"
              >
                Not Eligible to Apply
              </button>
            )}

          </div>

        </section>

      </div>

    </div>
  );
};

const Badge = ({ text }) => {
  if (!text) return null;

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
      {String(text).replaceAll("_", " ")}
    </span>
  );
};

const Info = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString();
};

export default InternshipDetails;