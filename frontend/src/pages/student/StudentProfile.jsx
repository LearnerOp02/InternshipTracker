import { useEffect, useState } from "react";

import {
  getMyStudentProfile,
  updateMyStudentProfile,
} from "../../services/studentService";

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    phone: "",
    department: "",
    year: "",
    batch: "",
    semester: "",
    cgpa: "",
    backlogs: "",
    skills: "",
    projects: "",
    certifications: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await getMyStudentProfile();

        const student =
          data.student ||
          data.profile ||
          data;

        setFormData({
          studentId: student?.studentId || "",
          phone: student?.phone || "",
          department: student?.department || "",
          year: student?.year || "",
          batch: student?.batch || "",
          semester: student?.semester || "",
          cgpa: student?.cgpa || "",
          backlogs: student?.backlogs ?? "",
          skills: student?.skills?.join(", ") || "",
          projects: student?.projects?.join(", ") || "",
          certifications:
            student?.certifications?.join(", ") || "",
        });
      } catch (error) {
        console.error("Student profile error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load student profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        studentId: formData.studentId.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),

        year: formData.year
          ? Number(formData.year)
          : undefined,

        batch: formData.batch.trim(),

        semester: formData.semester
          ? Number(formData.semester)
          : undefined,

        cgpa: formData.cgpa
          ? Number(formData.cgpa)
          : undefined,

        backlogs:
          formData.backlogs !== ""
            ? Number(formData.backlogs)
            : undefined,

        skills: convertToArray(formData.skills),
        projects: convertToArray(formData.projects),

        certifications: convertToArray(
          formData.certifications
        ),
      };

      await updateMyStudentProfile(payload);

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* PAGE TITLE */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Student Profile
        </h1>

        <p className="mt-1 text-slate-500">
          Maintain your academic and internship profile.
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
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        {/* ACADEMIC INFORMATION */}

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Academic Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <InputField
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Example: STU2201"
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />

            <InputField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Computer Engineering"
            />

            <InputField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              placeholder="3"
            />

            <InputField
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="2024-2027"
            />

            <InputField
              label="Semester"
              name="semester"
              type="number"
              value={formData.semester}
              onChange={handleChange}
              placeholder="5"
            />

            <InputField
              label="CGPA"
              name="cgpa"
              type="number"
              step="0.01"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="8.50"
            />

            <InputField
              label="Backlogs"
              name="backlogs"
              type="number"
              value={formData.backlogs}
              onChange={handleChange}
              placeholder="0"
            />

          </div>
        </div>


        {/* PROFESSIONAL INFORMATION */}

        <div className="mt-8 border-t border-slate-200 pt-8">

          <h2 className="text-lg font-semibold text-slate-900">
            Skills & Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter multiple values separated by commas.
          </p>

          <div className="mt-5 space-y-5">

            <TextAreaField
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js, MongoDB"
            />

            <TextAreaField
              label="Projects"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              placeholder="Student Internship Tracking System"
            />

            <TextAreaField
              label="Certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="MERN Stack Development"
            />

          </div>
        </div>


        {/* SAVE BUTTON */}

        <div className="mt-8 flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};


// ==========================================
// INPUT COMPONENT
// ==========================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
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
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
};


// ==========================================
// TEXTAREA COMPONENT
// ==========================================

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
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
        rows="3"
        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};

export default StudentProfile;