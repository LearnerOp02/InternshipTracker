import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCompanyApplicationById,
  scheduleInterview,
} from "../../services/applicationService";


const ScheduleInterview = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const [application, setApplication] =
    useState(null);

  const [formData, setFormData] =
    useState({
      interviewDate: "",
      interviewTime: "",
      mode: "",
      meetingLink: "",
      location: "",
      notes: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD APPLICATION
  // ==========================================

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);

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
          "Application load error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load application"
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);


  // ==========================================
  // CHANGE
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
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        interviewDate:
          formData.interviewDate,

        interviewTime:
          formData.interviewTime,

        mode:
          formData.mode,

        meetingLink:
          formData.meetingLink.trim(),

        location:
          formData.location.trim(),

        notes:
          formData.notes.trim(),
      };

      await scheduleInterview(
        id,
        payload
      );

      setSuccess(
        "Interview scheduled successfully."
      );

      setTimeout(() => {
        navigate(
          `/company/applications/${id}`
        );
      }, 700);

    } catch (error) {
      console.error(
        "Schedule interview error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to schedule interview"
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading application...
      </div>
    );
  }


  const student =
    application?.studentId ||
    application?.student ||
    {};

  const user =
    student?.userId ||
    student?.user ||
    {};

  const internship =
    application?.internshipId ||
    application?.internship ||
    {};


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          onClick={() =>
            navigate(
              `/company/applications/${id}`
            )
          }
          className="mb-3 text-sm font-medium text-blue-600"
        >
          ← Back to Application
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Schedule Interview
        </h1>

        <p className="mt-1 text-slate-500">
          Schedule an interview for the
          shortlisted student.
        </p>

      </div>


      {/* APPLICATION INFO */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="grid gap-5 md:grid-cols-3">

          <Info
            label="Student"
            value={
              student?.name ||
              user?.name
            }
          />

          <Info
            label="Email"
            value={
              student?.email ||
              user?.email
            }
          />

          <Info
            label="Internship"
            value={
              internship?.title
            }
          />

        </div>

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


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <InputField
            label="Interview Date"
            name="interviewDate"
            type="date"
            value={
              formData.interviewDate
            }
            onChange={
              handleChange
            }
            required
          />


          <InputField
            label="Interview Time"
            name="interviewTime"
            type="time"
            value={
              formData.interviewTime
            }
            onChange={
              handleChange
            }
            required
          />


          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Interview Mode
            </label>

            <select
              name="mode"
              value={
                formData.mode
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Select mode
              </option>

              <option value="online">
                Online
              </option>

              <option value="offline">
                Offline
              </option>

              <option value="phone">
                Phone
              </option>

            </select>

          </div>


          {formData.mode ===
            "online" && (
            <InputField
              label="Meeting Link"
              name="meetingLink"
              type="url"
              value={
                formData.meetingLink
              }
              onChange={
                handleChange
              }
              placeholder="https://meet.google.com/..."
              required
            />
          )}


          {formData.mode ===
            "offline" && (
            <InputField
              label="Interview Location"
              name="location"
              value={
                formData.location
              }
              onChange={
                handleChange
              }
              placeholder="Company office address"
              required
            />
          )}

        </div>


        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            name="notes"
            value={
              formData.notes
            }
            onChange={
              handleChange
            }
            rows="5"
            placeholder="Interview instructions, documents to carry, technical requirements..."
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/company/applications/${id}`
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? "Scheduling..."
              : "Schedule Interview"}
          </button>

        </div>

      </form>

    </div>
  );
};


const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
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
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

  </div>
);


const Info = ({
  label,
  value,
}) => (
  <div>

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-medium text-slate-800">
      {value || "N/A"}
    </p>

  </div>
);


export default ScheduleInterview;