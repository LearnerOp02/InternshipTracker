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
  checkInternshipEligibility,
  getInternshipById,
} from "../../services/internshipService";

import {
  applyForInternship,
} from "../../services/applicationService";

const ApplyInternship = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [internship, setInternship] =
    useState(null);

  const [eligibility, setEligibility] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          internshipResponse,
          eligibilityResponse,
        ] = await Promise.all([
          getInternshipById(id),
          checkInternshipEligibility(id),
        ]);

        const internshipData =
          internshipResponse.internship ||
          internshipResponse.data ||
          internshipResponse;

        const eligibilityData =
          eligibilityResponse.eligibility ||
          eligibilityResponse.data ||
          eligibilityResponse;

        setInternship(internshipData);

        setEligibility(
          eligibilityData
        );
      } catch (error) {
        console.error(
          "Apply page error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internship details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleApply = async () => {
    if (!eligibility?.eligible) {
      setError(
        "You are not eligible for this internship."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await applyForInternship(id);

      setSuccess(
        "Application submitted successfully."
      );

      setTimeout(() => {
        navigate(
          "/student/applications"
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Loading application...
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">
        Internship not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">

      <Link
        to={`/student/internships/${id}`}
        className="mb-5 inline-block text-sm font-medium text-blue-600"
      >
        ← Back to Internship
      </Link>


      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

        <div className="border-b border-slate-200 pb-6">

          <h1 className="text-3xl font-bold text-slate-900">
            Apply for Internship
          </h1>

          <p className="mt-2 text-slate-500">
            Review the internship details
            before submitting your
            application.
          </p>

        </div>


        {/* INTERNSHIP */}

        <div className="py-6">

          <h2 className="text-xl font-semibold">
            {internship.title}
          </h2>

          <p className="mt-1 font-medium text-blue-600">
            {internship.companyId
              ?.companyName ||
              "Company"}
          </p>


          <div className="mt-5 grid gap-4 sm:grid-cols-2">

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
              label="Openings"
              value={
                internship.openings
              }
            />

            <Info
              label="Deadline"
              value={
                internship.applicationDeadline
                  ? new Date(
                      internship.applicationDeadline
                    ).toLocaleDateString()
                  : "N/A"
              }
            />

          </div>

        </div>


        {/* ELIGIBILITY */}

        <div className="border-t border-slate-200 py-6">

          <h2 className="text-lg font-semibold">
            Eligibility Status
          </h2>

          {eligibility?.eligible ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">

              <p className="font-medium text-green-700">
                ✓ Eligible
              </p>

              <p className="mt-1 text-sm text-green-600">
                You meet the internship
                requirements.
              </p>

            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

              <p className="font-medium text-red-700">
                Not Eligible
              </p>

              {eligibility?.reasons
                ?.length > 0 && (
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

            </div>
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


        {/* SUBMIT */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">

          <Link
            to={`/student/internships/${id}`}
            className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={
              !eligibility?.eligible ||
              submitting
            }
            onClick={handleApply}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting
              ? "Submitting..."
              : "Confirm Application"}
          </button>

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

export default ApplyInternship;