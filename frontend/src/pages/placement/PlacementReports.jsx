/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  getPlacementReports,
} from "../../services/placementService";


const PlacementReports = () => {
  const [reports, setReports] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {
    loadReports();
  }, []);


  const loadReports = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getPlacementReports();

      setReports(
        data.summary || null
      );

    } catch (error) {
      console.error(
        "Load reports error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load reports"
      );

    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading reports...
      </div>
    );
  }


  if (!reports) {
    return (
      <div className="p-6">
        {message ||
          "No report data available."}
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Reports & Analytics
        </h1>

        <p className="mt-2 text-gray-500">
          Overview of students,
          companies, internships,
          applications and internship
          progress.
        </p>

      </div>


      {/* MESSAGE */}
      {message && (
        <div
          className="
            mb-6
            rounded-lg
            border
            border-red-200
            bg-red-50
            p-4
            text-red-700
          "
        >
          {message}
        </div>
      )}


      {/* MAIN STATS */}
      <div
        className="
          mb-8
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          title="Students"
          value={
            reports.students?.total || 0
          }
        />

        <StatCard
          title="Companies"
          value={
            reports.companies?.total || 0
          }
        />

        <StatCard
          title="Internships"
          value={
            reports.internships?.total ||
            0
          }
        />

        <StatCard
          title="Applications"
          value={
            reports.applications?.total ||
            0
          }
        />

      </div>


      {/* APPLICATION ANALYTICS */}
      <Section title="Application Analytics">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >

          <SmallCard
            title="Selected"
            value={
              reports.applications
                ?.selected || 0
            }
          />

          <SmallCard
            title="Rejected"
            value={
              reports.applications
                ?.rejected || 0
            }
          />

          <SmallCard
            title="Selection Rate"
            value={`${
              reports.applications
                ?.selectionRate || 0
            }%`}
          />

        </div>

      </Section>


      {/* INTERNSHIP ANALYTICS */}
      <Section title="Internship Analytics">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >

          <SmallCard
            title="Published"
            value={
              reports.internships
                ?.published || 0
            }
          />

          <SmallCard
            title="Ongoing"
            value={
              reports.internships
                ?.ongoing || 0
            }
          />

          <SmallCard
            title="Completed"
            value={
              reports.internships
                ?.completed || 0
            }
          />

        </div>

      </Section>


      {/* COMPANY ANALYTICS */}
      <Section title="Company Analytics">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >

          <SmallCard
            title="Total Companies"
            value={
              reports.companies?.total ||
              0
            }
          />

          <SmallCard
            title="Approved Companies"
            value={
              reports.companies
                ?.approved || 0
            }
          />

        </div>

      </Section>


      {/* TASK ANALYTICS */}
      <Section title="Task Progress">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >

          <SmallCard
            title="Total Tasks"
            value={
              reports.tasks?.total || 0
            }
          />

          <SmallCard
            title="Completed Tasks"
            value={
              reports.tasks?.completed ||
              0
            }
          />

          <SmallCard
            title="Completion Rate"
            value={`${
              reports.tasks
                ?.completionRate || 0
            }%`}
          />

        </div>

      </Section>


      {/* DOCUMENT ANALYTICS */}
      <Section title="Document Verification">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-3
          "
        >

          <SmallCard
            title="Documents"
            value={
              reports.documents?.total ||
              0
            }
          />

          <SmallCard
            title="Verified"
            value={
              reports.documents
                ?.verified || 0
            }
          />

          <SmallCard
            title="Verification Rate"
            value={`${
              reports.documents
                ?.verificationRate || 0
            }%`}
          />

        </div>

      </Section>

    </div>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
  title,
  value,
}) => {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-6
        shadow-sm
      "
    >

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// SMALL CARD
// ==========================================

const SmallCard = ({
  title,
  value,
}) => {
  return (
    <div
      className="
        rounded-lg
        border
        bg-gray-50
        p-5
      "
    >

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// SECTION
// ==========================================

const Section = ({
  title,
  children,
}) => {
  return (
    <div
      className="
        mb-6
        rounded-xl
        border
        bg-white
        p-6
      "
    >

      <h2
        className="
          mb-5
          text-xl
          font-semibold
        "
      >
        {title}
      </h2>

      {children}

    </div>
  );
};


export default PlacementReports;