import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../context/AuthContext";

import {
  getCompanyDashboard,
} from "../../services/dashboardService";

const CompanyDashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const data =
          await getCompanyDashboard();

        setDashboard(
          data.dashboard || data
        );
      } catch (error) {
        console.error(
          "Company dashboard error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  const internships =
    dashboard?.internships || {};

  const applications =
    dashboard?.applications || {};

  const recentApplications =
    applications.recent || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-1 text-slate-500">
          Manage internships and student
          recruitment.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Internships"
          value={
            internships.total || 0
          }
          subtitle="Total internships"
        />

        <StatCard
          title="Applications"
          value={
            applications.total || 0
          }
          subtitle="Student applications"
        />

        <StatCard
          title="Shortlisted"
          value={
            applications.shortlisted ||
            0
          }
          subtitle="Shortlisted students"
        />

        <StatCard
          title="Selected"
          value={
            applications.selected ||
            0
          }
          subtitle="Selected students"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Recent Applications
          </h2>

          {recentApplications.length ===
          0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No recent applications.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {recentApplications.map(
                (application) => (
                  <div
                    key={
                      application._id
                    }
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-medium">
                      {application
                        .studentId
                        ?.studentId ||
                        "Student"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {application
                        .internshipId
                        ?.title ||
                        "Internship"}
                    </p>

                    <p className="mt-2 text-sm capitalize text-blue-600">
                      {application.status
                        ?.replaceAll(
                          "_",
                          " "
                        )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Internship Overview
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Published
              </p>

              <p className="mt-1 text-2xl font-bold">
                {internships.published ||
                  0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Pending Approval
              </p>

              <p className="mt-1 text-2xl font-bold">
                {internships.pending ||
                  0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Ongoing
              </p>

              <p className="mt-1 text-2xl font-bold">
                {internships.ongoing ||
                  0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {internships.completed ||
                  0}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;