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
  getCompanyInternshipById,
  updateCompanyInternship,
  submitInternshipForApproval,
} from "../../services/internshipService";

const CompanyInternshipDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [internship, setInternship] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      location: "",
      workMode: "",
      duration: "",
      stipend: "",
      openings: "",
      requiredSkills: "",
      eligibleBranches: "",
      eligibleYears: "",
      minimumCgpa: "",
      maximumBacklogs: "",
      applicationDeadline: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [editMode, setEditMode] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD INTERNSHIP
  // ==========================================

  const loadInternship = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCompanyInternshipById(
          id
        );

      const internshipData =
        data.internship ||
        data.data ||
        data;

      setInternship(
        internshipData
      );

      setFormData({
        title:
          internshipData?.title || "",

        description:
          internshipData?.description || "",

        location:
          internshipData?.location || "",

        workMode:
          internshipData?.workMode || "",

        duration:
          internshipData?.duration || "",

        stipend:
          internshipData?.stipend || "",

        openings:
          internshipData?.openings || "",

        requiredSkills:
          arrayToText(
            internshipData?.requiredSkills
          ),

        eligibleBranches:
          arrayToText(
            internshipData?.eligibleBranches
          ),

        eligibleYears:
          arrayToText(
            internshipData?.eligibleYears
          ),

        minimumCgpa:
          internshipData?.minimumCgpa ??
          "",

        maximumBacklogs:
          internshipData?.maximumBacklogs ??
          "",

        applicationDeadline:
          formatDateForInput(
            internshipData?.applicationDeadline ||
              internshipData?.deadline
          ),
      });

    } catch (error) {
      console.error(
        "Internship details error:",
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


  useEffect(() => {
    loadInternship();
  }, [id]);


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
  // SAVE CHANGES
  // ==========================================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload =
        buildPayload(
          formData
        );

      const data =
        await updateCompanyInternship(
          id,
          payload
        );

      const updatedInternship =
        data.internship ||
        data.data ||
        data;

      setInternship(
        updatedInternship
      );

      setSuccess(
        "Internship updated successfully."
      );

      setEditMode(false);

      await loadInternship();

    } catch (error) {
      console.error(
        "Update internship error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update internship"
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // SUBMIT FOR APPROVAL
  // ==========================================

  const handleSubmitApproval =
    async () => {
      try {
        setSubmitting(true);
        setError("");
        setSuccess("");

        await submitInternshipForApproval(
          id
        );

        setSuccess(
          "Internship submitted for approval successfully."
        );

        await loadInternship();

      } catch (error) {
        console.error(
          "Submit approval error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to submit internship for approval"
        );
      } finally {
        setSubmitting(false);
      }
    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading internship...
      </div>
    );
  }


  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!internship) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-900">
          Internship not found
        </h2>

        <Link
          to="/company/internships"
          className="mt-4 inline-block text-blue-600"
        >
          ← Back to internships
        </Link>

      </div>
    );
  }


  const canEdit =
    internship.status ===
      "draft" ||
    internship.status ===
      "rejected";


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/company/internships"
              )
            }
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to My Internships
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            {internship.title}
          </h1>

          <p className="mt-1 text-slate-500">
            View and manage internship details.
          </p>

        </div>


        <StatusBadge
          status={
            internship.status
          }
        />

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


      {/* STATUS INFORMATION */}

      <StatusMessage
        status={
          internship.status
        }
      />


      {/* ACTIONS */}

      <div className="mb-6 flex flex-wrap gap-3">

        {canEdit &&
          !editMode && (
            <button
              type="button"
              onClick={() =>
                setEditMode(true)
              }
              className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 font-medium text-blue-700 hover:bg-blue-100"
            >
              Edit Internship
            </button>
          )}


        {internship.status ===
          "draft" && (
          <button
            type="button"
            onClick={
              handleSubmitApproval
            }
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit for Approval"}
          </button>
        )}

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSave}
        className="space-y-6"
      >

        <Section
          title="Basic Details"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="Internship Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!editMode}
            />


            <SelectField
              label="Work Mode"
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              disabled={!editMode}
              options={[
                {
                  value: "",
                  label: "Select",
                },
                {
                  value: "onsite",
                  label: "Onsite",
                },
                {
                  value: "remote",
                  label: "Remote",
                },
                {
                  value: "hybrid",
                  label: "Hybrid",
                },
              ]}
            />


            <InputField
              label="Duration"
              name="duration"
              value={
                formData.duration
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Stipend"
              name="stipend"
              value={
                formData.stipend
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Openings"
              name="openings"
              type="number"
              value={
                formData.openings
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Application Deadline"
              name="applicationDeadline"
              type="date"
              value={
                formData.applicationDeadline
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />

          </div>


          <div className="mt-5">

            <TextAreaField
              label="Description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />

          </div>

        </Section>


        {/* SKILLS */}

        <Section
          title="Required Skills"
        >

          <InputField
            label="Skills"
            name="requiredSkills"
            value={
              formData.requiredSkills
            }
            onChange={
              handleChange
            }
            disabled={!editMode}
          />

        </Section>


        {/* ELIGIBILITY */}

        <Section
          title="Eligibility Criteria"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="Eligible Branches"
              name="eligibleBranches"
              value={
                formData.eligibleBranches
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Eligible Years"
              name="eligibleYears"
              value={
                formData.eligibleYears
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Minimum CGPA"
              name="minimumCgpa"
              type="number"
              step="0.01"
              value={
                formData.minimumCgpa
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />


            <InputField
              label="Maximum Backlogs"
              name="maximumBacklogs"
              type="number"
              value={
                formData.maximumBacklogs
              }
              onChange={
                handleChange
              }
              disabled={!editMode}
            />

          </div>

        </Section>


        {/* EDIT BUTTONS */}

        {editMode && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                loadInternship();
              }}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>
        )}

      </form>

    </div>
  );
};


// ==========================================
// BUILD PAYLOAD
// ==========================================

const buildPayload = (
  formData
) => {
  return {
    title:
      formData.title.trim(),

    description:
      formData.description.trim(),

    location:
      formData.location.trim(),

    workMode:
      formData.workMode,

    duration:
      formData.duration.trim(),

    stipend:
      formData.stipend,

    openings:
      Number(
        formData.openings
      ),

    requiredSkills:
      splitCommaValues(
        formData.requiredSkills
      ),

    eligibleBranches:
      splitCommaValues(
        formData.eligibleBranches
      ),

    eligibleYears:
      splitCommaValues(
        formData.eligibleYears
      ).map(Number),

    minimumCgpa:
      formData.minimumCgpa
        ? Number(
            formData.minimumCgpa
          )
        : 0,

    maximumBacklogs:
      formData.maximumBacklogs
        ? Number(
            formData.maximumBacklogs
          )
        : 0,

    applicationDeadline:
      formData.applicationDeadline,
  };
};


// ==========================================
// STATUS MESSAGE
// ==========================================

const StatusMessage = ({
  status,
}) => {
  const messages = {
    draft:
      "This internship is currently a draft. You can edit it and submit it for Placement Cell approval.",

    pending_approval:
      "This internship is waiting for Placement Cell approval.",

    approved:
      "This internship has been approved by the Placement Cell.",

    published:
      "This internship is currently published and visible to eligible students.",

    rejected:
      "This internship was rejected. You can edit the details and submit it again.",

    application_closed:
      "Applications for this internship are closed.",

    ongoing:
      "This internship is currently ongoing.",

    completed:
      "This internship has been completed.",

    archived:
      "This internship has been archived.",
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-700">
        Status Information
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {messages[status] ||
          "Internship status information is unavailable."}
      </p>

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

    rejected:
      "bg-red-50 text-red-700",

    application_closed:
      "bg-orange-50 text-orange-700",

    ongoing:
      "bg-purple-50 text-purple-700",

    completed:
      "bg-green-50 text-green-700",

    archived:
      "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-4 py-2 text-sm font-medium capitalize ${
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
// SECTION
// ==========================================

const Section = ({
  title,
  children,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-5 text-xl font-semibold text-slate-900">
      {title}
    </h2>

    {children}

  </div>
);


// ==========================================
// INPUT
// ==========================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  step,
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
      disabled={disabled}
      step={step}
      className={`w-full rounded-lg border px-4 py-3 outline-none ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
          : "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }`}
    />

  </div>
);


// ==========================================
// SELECT
// ==========================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled,
}) => (
  <div>

    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-lg border px-4 py-3 outline-none ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50"
          : "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }`}
    >
      {options.map(
        (option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        )
      )}
    </select>

  </div>
);


// ==========================================
// TEXTAREA
// ==========================================

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  disabled,
}) => (
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
      rows="6"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full resize-none rounded-lg border px-4 py-3 outline-none ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-600"
          : "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      }`}
    />

  </div>
);


// ==========================================
// HELPERS
// ==========================================

const splitCommaValues = (
  value
) => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
};


const arrayToText = (
  value
) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value || "";
};


const formatDateForInput = (
  date
) => {
  if (!date) {
    return "";
  }

  return new Date(date)
    .toISOString()
    .split("T")[0];
};


export default CompanyInternshipDetails;