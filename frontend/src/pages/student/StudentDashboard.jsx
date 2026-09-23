import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../context/AuthContext";

import {
  getStudentDashboard,
} from "../../services/dashboardService";

const StudentDashboard = () => {
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
        setError("");

        const data =
          await getStudentDashboard();

        setDashboard(
          data.dashboard || data
        );
      } catch (error) {
        console.error(
          "Student dashboard error:",
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

  const applications =
    dashboard?.applications || {};

  const tasks =
    dashboard?.tasks || {};

  const progress =
    dashboard?.progress || [];

  const recentApplications =
    applications.recent || [];

  const activeInternship =
    dashboard?.activeInternship;

  const completedTasks =
    tasks.completed || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-1 text-slate-500">
          Track your internship journey
          from one place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Applications"
          value={
            applications.total || 0
          }
          subtitle="Total applications"
        />

        <StatCard
          title="Shortlisted"
          value={
            applications.shortlisted ||
            0
          }
          subtitle="Current shortlisted applications"
        />

        <StatCard
          title="Active Internship"
          value={
            activeInternship ? 1 : 0
          }
          subtitle="Ongoing internship"
        />

        <StatCard
          title="Tasks Completed"
          value={completedTasks}
          subtitle="Internship task progress"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        {/* RECENT APPLICATIONS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Applications
          </h2>

          {recentApplications.length ===
          0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No applications found.
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
                    <p className="font-medium text-slate-900">
                      {application
                        .internshipId
                        ?.title ||
                        "Internship"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {application
                        .companyId
                        ?.companyName ||
                        "Company"}
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


        {/* PROGRESS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Internship Progress
          </h2>

          {progress.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No internship progress
              available.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {progress.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">
                      {item.status?.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                    <p className="font-semibold text-blue-600">
                      {item.percentage ||
                        0}
                      %
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${
                          item.percentage ||
                          0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;