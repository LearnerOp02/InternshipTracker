/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getCompanies,
  getPendingInternships,
} from "../../services/placementService";

const PlacementDashboard = () => {
  const [stats, setStats] = useState({
    pendingCompanies: 0,
    pendingInternships: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        companyData,
        internshipData,
      ] = await Promise.all([
        getCompanies(),
        getPendingInternships(),
      ]);

      // COMPANY DATA
      const companies =
        companyData.companies ||
        companyData.data ||
        companyData ||
        [];

      const pendingCompanies =
        Array.isArray(companies)
          ? companies.filter(
              (company) =>
                company.verificationStatus ===
                "pending"
            ).length
          : 0;

      // INTERNSHIP DATA
      const internships =
        internshipData.internships ||
        internshipData.data ||
        internshipData ||
        [];

      setStats({
        pendingCompanies,
        pendingInternships:
          Array.isArray(internships)
            ? internships.length
            : 0,
      });
    } catch (error) {
      console.error(
        "Placement dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Pending Companies",
      value: stats.pendingCompanies,
      link: "/placement/companies",
    },
    {
      title: "Pending Internships",
      value: stats.pendingInternships,
      link: "/placement/internships",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Placement Cell Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage companies, internships,
          students and placement activities.
        </p>

      </div>


      {/* STAT CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-8
        "
      >

        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="
              bg-white
              border
              rounded-xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            <p className="text-gray-500">
              {card.title}
            </p>

            <h2
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {card.value}
            </h2>

          </Link>
        ))}

      </div>


      {/* QUICK ACTIONS */}
      <div
        className="
          bg-white
          border
          rounded-xl
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            mb-5
          "
        >
          Quick Actions
        </h2>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-4
          "
        >

          <Link
            to="/placement/companies"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            Review Companies
          </Link>


          <Link
            to="/placement/internships"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            Review Internships
          </Link>


          <Link
            to="/placement/students"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            View Students
          </Link>


          <Link
            to="/placement/applications"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            View Applications
          </Link>


          <Link
            to="/placement/reports"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            View Reports
          </Link>


          <Link
            to="/placement/audit-logs"
            className="
              border
              rounded-lg
              p-4
              hover:bg-gray-50
            "
          >
            Audit Logs
          </Link>

        </div>

      </div>

    </div>
  );
};

export default PlacementDashboard;