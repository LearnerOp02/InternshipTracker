/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getPublishedInternships,
} from "../../services/internshipService";

const Internships = () => {
  const [internships, setInternships] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    workMode: "",
    branch: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanFilters = {};

      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) {
          cleanFilters[key] = value.trim();
        }
      });

      const data = await getPublishedInternships(
        cleanFilters
      );

      const internshipList =
        data.internships ||
        data.data ||
        data ||
        [];

      setInternships(
        Array.isArray(internshipList)
          ? internshipList
          : []
      );
    } catch (error) {
      console.error(
        "Load internships error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load internships"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loadInternships();
  };

  const handleReset = () => {
    const emptyFilters = {
      search: "",
      location: "",
      workMode: "",
      branch: "",
    };

    setFilters(emptyFilters);

    setTimeout(() => {
      loadInternshipsWithFilters({});
    }, 0);
  };

  const loadInternshipsWithFilters = async (
    customFilters
  ) => {
    try {
      setLoading(true);
      setError("");

      const data = await getPublishedInternships(
        customFilters
      );

      const internshipList =
        data.internships ||
        data.data ||
        data ||
        [];

      setInternships(
        Array.isArray(internshipList)
          ? internshipList
          : []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load internships"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* PAGE TITLE */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Browse Internships
        </h1>

        <p className="mt-1 text-slate-500">
          Explore approved internship opportunities
          available for students.
        </p>
      </div>


      {/* FILTERS */}

      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search internship..."
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Location"
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="workMode"
            value={filters.workMode}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">
              All Work Modes
            </option>

            <option value="onsite">
              Onsite
            </option>

            <option value="hybrid">
              Hybrid
            </option>

            <option value="remote">
              Remote
            </option>
          </select>

          <input
            type="text"
            name="branch"
            value={filters.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />

        </div>

        <div className="mt-4 flex gap-3">

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
          >
            Reset
          </button>

        </div>
      </form>


      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          Loading internships...
        </div>
      ) : internships.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

          <h2 className="text-lg font-semibold">
            No internships found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search filters.
          </p>

        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">

          {internships.map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
            />
          ))}

        </div>
      )}

    </div>
  );
};

const InternshipCard = ({ internship }) => {
  const companyName =
    internship.companyId?.companyName ||
    "Company";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {internship.title}
          </h2>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {companyName}
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">
          {internship.workMode || "N/A"}
        </span>

      </div>


      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {internship.description ||
          "No description available."}
      </p>


      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">

        <Detail
          label="Location"
          value={
            internship.location || "N/A"
          }
        />

        <Detail
          label="Duration"
          value={
            internship.duration || "N/A"
          }
        />

        <Detail
          label="Stipend"
          value={
            internship.stipend ||
            "Not specified"
          }
        />

        <Detail
          label="Openings"
          value={
            internship.openings ?? "N/A"
          }
        />

      </div>


      {internship.requiredSkills?.length > 0 && (
        <div className="mt-5">

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Required Skills
          </p>

          <div className="flex flex-wrap gap-2">

            {internship.requiredSkills
              .slice(0, 5)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                >
                  {skill}
                </span>
              ))}

          </div>
        </div>
      )}


      <div className="mt-6 flex items-center justify-between">

        <div>
          <p className="text-xs text-slate-500">
            Application Deadline
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {internship.applicationDeadline
              ? new Date(
                  internship.applicationDeadline
                ).toLocaleDateString()
              : "Not specified"}
          </p>
        </div>

        <Link
          to={`/student/internships/${internship._id}`}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

const Detail = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default Internships;