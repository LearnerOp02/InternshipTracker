import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  createInternship,
  submitInternshipForApproval,
} from "../../services/internshipService";

const CreateInternship = () => {
  const navigate =
    useNavigate();

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

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // HANDLE INPUT
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
  // BUILD PAYLOAD
  // ==========================================

  const buildPayload = () => {
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
        Number(formData.openings),

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

      status: "draft",
    };
  };


  // ==========================================
  // SAVE AS DRAFT
  // ==========================================

  const handleSaveDraft = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload =
        buildPayload();

      await createInternship(
        payload
      );

      setSuccess(
        "Internship saved as draft successfully."
      );

      setTimeout(() => {
        navigate(
          "/company/internships"
        );
      }, 700);

    } catch (error) {
      console.error(
        "Create internship error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create internship"
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // CREATE + SUBMIT FOR APPROVAL
  // ==========================================

  const handleSubmitApproval =
    async () => {
      try {
        setSaving(true);
        setError("");
        setSuccess("");

        const payload =
          buildPayload();

        const response =
          await createInternship(
            payload
          );

        const internship =
          response.internship ||
          response.data ||
          response;

        const internshipId =
          internship?._id;

        if (!internshipId) {
          throw new Error(
            "Internship ID not found after creation."
          );
        }

        await submitInternshipForApproval(
          internshipId
        );

        setSuccess(
          "Internship submitted for approval successfully."
        );

        setTimeout(() => {
          navigate(
            "/company/internships"
          );
        }, 700);

      } catch (error) {
        console.error(
          "Submit internship error:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to submit internship"
        );
      } finally {
        setSaving(false);
      }
    };


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Create Internship
        </h1>

        <p className="mt-1 text-slate-500">
          Create a new internship opportunity
          for students.
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


      <form
        onSubmit={
          handleSaveDraft
        }
        className="space-y-6"
      >

        {/* BASIC DETAILS */}

        <Section
          title="Basic Details"
          description="Enter the main internship information."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="Internship Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Frontend Developer Intern"
              required
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Mumbai"
              required
            />


            <SelectField
              label="Work Mode"
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              required
              options={[
                {
                  value: "",
                  label:
                    "Select work mode",
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
              placeholder="3 Months"
              required
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
              placeholder="₹10,000 / month"
            />


            <InputField
              label="Number of Openings"
              name="openings"
              type="number"
              min="1"
              value={
                formData.openings
              }
              onChange={
                handleChange
              }
              required
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
              required
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
              placeholder="Describe the internship role, responsibilities and learning opportunities..."
              required
            />

          </div>

        </Section>


        {/* SKILLS */}

        <Section
          title="Required Skills"
          description="Enter skills separated by commas."
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
            placeholder="React, JavaScript, Git, REST API"
          />

        </Section>


        {/* ELIGIBILITY */}

        <Section
          title="Eligibility Criteria"
          description="Set the requirements students must meet before applying."
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
              placeholder="Computer, IT, AIML"
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
              placeholder="2, 3, 4"
            />


            <InputField
              label="Minimum CGPA"
              name="minimumCgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={
                formData.minimumCgpa
              }
              onChange={
                handleChange
              }
              placeholder="7.0"
            />


            <InputField
              label="Maximum Backlogs"
              name="maximumBacklogs"
              type="number"
              min="0"
              value={
                formData.maximumBacklogs
              }
              onChange={
                handleChange
              }
              placeholder="0"
            />

          </div>

        </Section>


        {/* WORKFLOW INFO */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <h3 className="font-semibold text-blue-900">
            Internship Approval Workflow
          </h3>

          <p className="mt-2 text-sm leading-6 text-blue-700">
            Saving as draft keeps the internship
            private. Submitting for approval sends
            it to the Placement Cell. Students can
            only see the internship after it has
            been approved and published.
          </p>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/company/internships"
              )
            }
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={saving}
            className="rounded-lg border border-blue-200 bg-blue-50 px-6 py-3 font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save as Draft"}
          </button>


          <button
            type="button"
            onClick={
              handleSubmitApproval
            }
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Submitting..."
              : "Submit for Approval"}
          </button>

        </div>

      </form>

    </div>
  );
};


// ==========================================
// SECTION
// ==========================================

const Section = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-5">

        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}

      </div>

      {children}

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
  placeholder,
  required,
  min,
  max,
  step,
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
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


// ==========================================
// SELECT
// ==========================================

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        rows="6"
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


// ==========================================
// COMMA VALUE HELPER
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


export default CreateInternship;