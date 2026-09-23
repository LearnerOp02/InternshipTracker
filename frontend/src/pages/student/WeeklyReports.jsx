/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  createWeeklyReport,
  getMyWeeklyReports,
} from "../../services/weeklyReportService";

const WeeklyReports = () => {
  const [reports, setReports] = useState([]);

  const [formData, setFormData] = useState({
    weekNumber: "",
    startDate: "",
    endDate: "",
    workDone: "",
    skillsLearned: "",
    challenges: "",
    hoursWorked: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD REPORTS
  // ==========================================

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyWeeklyReports();

      const reportList =
        data.reports ||
        data.weeklyReports ||
        data.data ||
        data ||
        [];

      setReports(
        Array.isArray(reportList)
          ? reportList
          : []
      );
    } catch (error) {
      console.error(
        "Weekly reports error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load weekly reports"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReports();
  }, []);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ==========================================
  // SUBMIT REPORT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        weekNumber: Number(
          formData.weekNumber
        ),

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        workDone:
          formData.workDone.trim(),

        skillsLearned:
          formData.skillsLearned.trim(),

        challenges:
          formData.challenges.trim(),

        hoursWorked: Number(
          formData.hoursWorked
        ),
      };

      await createWeeklyReport(
        payload
      );

      setSuccess(
        "Weekly report submitted successfully."
      );

      setFormData({
        weekNumber: "",
        startDate: "",
        endDate: "",
        workDone: "",
        skillsLearned: "",
        challenges: "",
        hoursWorked: "",
      });

      await loadReports();

    } catch (error) {
      console.error(
        "Submit report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit weekly report"
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Weekly Reports
        </h1>

        <p className="mt-1 text-slate-500">
          Submit and track your weekly
          internship work.
        </p>

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


      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">


        {/* ================================= */}
        {/* REPORT FORM */}
        {/* ================================= */}

        <div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <h2 className="text-xl font-semibold text-slate-900">
              Submit Weekly Report
            </h2>


            <div className="mt-5 space-y-4">

              <InputField
                label="Week Number"
                name="weekNumber"
                type="number"
                value={
                  formData.weekNumber
                }
                onChange={
                  handleChange
                }
                min="1"
                required
              />


              <div className="grid grid-cols-2 gap-3">

                <InputField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={
                    formData.startDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <InputField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={
                    formData.endDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <TextAreaField
                label="Work Done"
                name="workDone"
                value={
                  formData.workDone
                }
                onChange={
                  handleChange
                }
                placeholder="Describe the work completed this week..."
                required
              />


              <TextAreaField
                label="Skills Learned"
                name="skillsLearned"
                value={
                  formData.skillsLearned
                }
                onChange={
                  handleChange
                }
                placeholder="Describe new skills or technologies learned..."
                required
              />


              <TextAreaField
                label="Challenges"
                name="challenges"
                value={
                  formData.challenges
                }
                onChange={
                  handleChange
                }
                placeholder="Mention challenges faced during the week..."
                required
              />


              <InputField
                label="Hours Worked"
                name="hoursWorked"
                type="number"
                value={
                  formData.hoursWorked
                }
                onChange={
                  handleChange
                }
                min="0"
                required
              />


              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Report"}
              </button>

            </div>

          </form>

        </div>


        {/* ================================= */}
        {/* REPORT HISTORY */}
        {/* ================================= */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Report History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {reports.length} report(s)
                submitted
              </p>
            </div>

          </div>


          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <h3 className="font-semibold text-slate-900">
                No weekly reports yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your submitted weekly
                reports will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {reports.map(
                (report) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                  />
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};


// ==========================================
// REPORT CARD
// ==========================================

const ReportCard = ({
  report,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            Week {report.weekNumber}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {formatDate(
              report.startDate
            )}
            {" - "}
            {formatDate(
              report.endDate
            )}
          </p>

        </div>


        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {report.hoursWorked || 0} Hours
        </div>

      </div>


      <div className="mt-5 space-y-4">

        <ReportSection
          title="Work Done"
          value={report.workDone}
        />

        <ReportSection
          title="Skills Learned"
          value={
            Array.isArray(
              report.skillsLearned
            )
              ? report.skillsLearned.join(
                  ", "
                )
              : report.skillsLearned
          }
        />

        <ReportSection
          title="Challenges"
          value={report.challenges}
        />

      </div>


      <div className="mt-5 border-t border-slate-200 pt-4">

        <p className="text-xs text-slate-500">
          Submitted:{" "}
          {formatDateTime(
            report.createdAt
          )}
        </p>

      </div>

    </div>
  );
};


// ==========================================
// REPORT SECTION
// ==========================================

const ReportSection = ({
  title,
  value,
}) => {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
        {value || "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// INPUT
// ==========================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  min,
  required,
}) => {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


// ==========================================
// TEXTAREA
// ==========================================

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows="4"
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


// ==========================================
// DATE HELPERS
// ==========================================

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString();
};


const formatDateTime = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleString();
};


export default WeeklyReports;