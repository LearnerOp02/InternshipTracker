import {
  useEffect,
  useState,
} from "react";

import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
} from "../../services/companyService";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    contactPerson: "",
    phone: "",
    address: "",
    description: "",
  });

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD COMPANY PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyCompanyProfile();

        const company =
          data.company ||
          data.data ||
          data;

        setFormData({
          companyName:
            company?.companyName || "",

          industry:
            company?.industry || "",

          website:
            company?.website || "",

          contactPerson:
            company?.contactPerson || "",

          phone:
            company?.phone || "",

          address:
            company?.address || "",

          description:
            company?.description || "",
        });

        setVerificationStatus(
          company?.verificationStatus ||
            company?.status ||
            "pending"
        );

      } catch (error) {
        console.error(
          "Company profile error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load company profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
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
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateMyCompanyProfile(
        formData
      );

      setSuccess(
        "Company profile updated successfully."
      );

    } catch (error) {
      console.error(
        "Update company profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update company profile"
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading company profile...
      </div>
    );
  }


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Company Profile
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your company information.
        </p>

      </div>


      {/* VERIFICATION STATUS */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <p className="text-sm text-slate-500">
          Verification Status
        </p>

        <div className="mt-2">

          <VerificationBadge
            status={
              verificationStatus
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


      {/* PROFILE FORM */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div className="grid gap-5 md:grid-cols-2">

          <InputField
            label="Company Name"
            name="companyName"
            value={
              formData.companyName
            }
            onChange={
              handleChange
            }
            required
          />

          <InputField
            label="Industry"
            name="industry"
            value={
              formData.industry
            }
            onChange={
              handleChange
            }
            placeholder="Example: IT, Manufacturing"
          />

          <InputField
            label="Website"
            name="website"
            type="url"
            value={
              formData.website
            }
            onChange={
              handleChange
            }
            placeholder="https://company.com"
          />

          <InputField
            label="Contact Person"
            name="contactPerson"
            value={
              formData.contactPerson
            }
            onChange={
              handleChange
            }
          />

          <InputField
            label="Phone"
            name="phone"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
          />

          <InputField
            label="Address"
            name="address"
            value={
              formData.address
            }
            onChange={
              handleChange
            }
          />

        </div>


        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Company Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows="5"
            placeholder="Describe your company..."
            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        <div className="mt-6">

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
// INPUT FIELD
// ==========================================

const InputField = ({
  label,
  name,
  type = "text",
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

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
};


// ==========================================
// VERIFICATION BADGE
// ==========================================

const VerificationBadge = ({
  status,
}) => {
  const normalized =
    status || "pending";

  const styles = {
    pending:
      "bg-yellow-50 text-yellow-700",

    approved:
      "bg-green-50 text-green-700",

    verified:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",
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


export default CompanyProfile;