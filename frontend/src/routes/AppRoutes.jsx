import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


// ==========================================
// COMMON PAGES
// ==========================================

import Login from "../pages/common/Login";
import Register from "../pages/common/Register";
import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";
import ComingSoon from "../pages/common/ComingSoon";


// ==========================================
// LAYOUTS
// ==========================================

import StudentLayout from "../layouts/StudentLayout";
import CompanyLayout from "../layouts/CompanyLayout";
import PlacementLayout from "../layouts/PlacementLayout";


// ==========================================
// ROUTE PROTECTION
// ==========================================

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";


// ==========================================
// STUDENT PAGES
// ==========================================

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import Internships from "../pages/student/Internships";
import InternshipDetails from "../pages/student/InternshipDetails";
import ApplyInternship from "../pages/student/ApplyInternship";
import MyApplications from "../pages/student/MyApplications";
import ApplicationDetails from "../pages/student/ApplicationDetails";
import MyInternship from "../pages/student/MyInternship";
import StudentTasks from "../pages/student/StudentTasks";
import WeeklyReports from "../pages/student/WeeklyReports";
import StudentDocuments from "../pages/student/StudentDocuments";
import InternshipHistory from "../pages/student/InternshipHistory";
import StudentNotifications from "../pages/student/StudentNotifications";


// ==========================================
// COMPANY PAGES
// ==========================================

import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanyInternships from "../pages/company/CompanyInternships";
import CreateInternship from "../pages/company/CreateInternship";
import CompanyInternshipDetails from "../pages/company/CompanyInternshipDetails";
import CompanyApplicants from "../pages/company/CompanyApplicants";
import CompanyApplicationDetails from "../pages/company/CompanyApplicationDetails";
import ScheduleInterview from "../pages/company/ScheduleInterview";
import CompanyInterviews from "../pages/company/CompanyInterviews";
import CompanyTasks from "../pages/company/CompanyTasks";
import CompanyEvaluations from "../pages/company/CompanyEvaluations";
import CompanyNotifications from "../pages/company/CompanyNotifications";


// ==========================================
// PLACEMENT CELL PAGES
// ==========================================

import PlacementDashboard from "../pages/placement/PlacementDashboard";
import PlacementCompanies from "../pages/placement/PlacementCompanies";
import PlacementInternships from "../pages/placement/PlacementInternships";
import ApprovedInternships from "../pages/placement/ApprovedInternships";
import PlacementStudents from "../pages/placement/PlacementStudents";
import PlacementApplications from "../pages/placement/PlacementApplications";
import PlacementDocuments from "../pages/placement/PlacementDocuments";
import InternshipMonitoring from "../pages/placement/InternshipMonitoring";
import PlacementReports from "../pages/placement/PlacementReports";
import PlacementAuditLogs from "../pages/placement/PlacementAuditLogs";
import PlacementNotifications from "../pages/placement/PlacementNotifications";

// ==========================================
// HOME REDIRECT
// ==========================================

const HomeRedirect = () => {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role === "student") {
    return (
      <Navigate
        to="/student/dashboard"
        replace
      />
    );
  }

  if (user.role === "company") {
    return (
      <Navigate
        to="/company/dashboard"
        replace
      />
    );
  }

  if (user.role === "placement_cell") {
    return (
      <Navigate
        to="/placement/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/unauthorized"
      replace
    />
  );
};


// ==========================================
// APP ROUTES
// ==========================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================================= */}
      {/* PUBLIC ROUTES */}
      {/* ================================= */}

      <Route
        path="/"
        element={<HomeRedirect />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />


      {/* ================================= */}
      {/* STUDENT ROUTES */}
      {/* ================================= */}

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute
              allowedRoles={[
                "student",
              ]}
            >
              <StudentLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <StudentDashboard />
          }
        />

        <Route
          path="profile"
          element={
            <StudentProfile />
          }
        />

        <Route
          path="internships"
          element={
            <Internships />
          }
        />

        <Route
          path="internships/:id"
          element={
            <InternshipDetails />
          }
        />

        <Route
          path="internships/:id/apply"
          element={
            <ApplyInternship />
          }
        />

        <Route
          path="applications"
          element={
            <MyApplications />
          }
        />

        <Route
          path="applications/:id"
          element={
            <ApplicationDetails />
          }
        />

        <Route
          path="my-internship"
          element={
            <MyInternship />
          }
        />

        <Route
          path="tasks"
          element={
            <StudentTasks />
          }
        />

        <Route
          path="weekly-reports"
          element={
            <WeeklyReports />
          }
        />

        <Route
          path="documents"
          element={
            <StudentDocuments />
          }
        />

        <Route
          path="history"
          element={
            <InternshipHistory />
          }
        />

        <Route
          path="notifications"
          element={
            <StudentNotifications />
          }
        />

      </Route>


      {/* ================================= */}
      {/* COMPANY ROUTES */}
      {/* ================================= */}

      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <RoleRoute
              allowedRoles={[
                "company",
              ]}
            >
              <CompanyLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <CompanyDashboard />
          }
        />

        <Route
          path="profile"
          element={
            <CompanyProfile />
          }
        />

        <Route
          path="internships"
          element={
            <CompanyInternships />
          }
        />

        <Route
          path="internships/create"
          element={
            <CreateInternship />
          }
        />

        <Route
          path="internships/:id"
          element={
            <CompanyInternshipDetails />
          }
        />

        <Route
          path="applicants"
          element={
            <CompanyApplicants />
          }
        />

        <Route
          path="applications/:id"
          element={
            <CompanyApplicationDetails />
          }
        />

        <Route
          path="applications/:id/interview"
          element={
            <ScheduleInterview />
          }
        />

        <Route
          path="interviews"
          element={
            <CompanyInterviews />
          }
        />

        <Route
          path="tasks"
          element={
            <CompanyTasks />
          }
        />

        <Route
          path="evaluations"
          element={
            <CompanyEvaluations />
          }
        />

        <Route
          path="notifications"
          element={
            <CompanyNotifications />
          }
        />

      </Route>


      {/* ================================= */}
      {/* PLACEMENT CELL ROUTES */}
      {/* ================================= */}

      <Route
        path="/placement"
        element={
          <ProtectedRoute>
            <RoleRoute
              allowedRoles={[
                "placement_cell",
              ]}
            >
              <PlacementLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <PlacementDashboard />
          }
        />

        <Route
          path="companies"
          element={
            <PlacementCompanies />
          }
        />

        <Route
          path="internships"
          element={
            <PlacementInternships />
          }
        />

        {/* APPROVED INTERNSHIPS */}
        <Route
          path="internships/approved"
          element={
            <ApprovedInternships />
          }
        />

        <Route
          path="students"
          element={
            <PlacementStudents />
          }
        />

        <Route
          path="companies/pending"
          element={
            <ComingSoon
              title="Pending Companies"
            />
          }
        />

        <Route
          path="internships/pending"
          element={
            <ComingSoon
              title="Pending Internships"
            />
          }
        />

        <Route
          path="applications"
          element={
            <PlacementApplications />
          }
        />

        <Route
          path="documents"
          element={
            <PlacementDocuments />
          }
        />

        <Route
          path="monitoring"
          element={
            <InternshipMonitoring />
          }
        />

        <Route
          path="reports"
          element={
            <PlacementReports />
          }
        />

        <Route
          path="audit-logs"
          element={
            <PlacementAuditLogs />
          }
        />

        <Route
          path="notifications"
          element={
            <PlacementNotifications />
          }
        />

      </Route>

      {/* ================================= */}
      {/* 404 */}
      {/* ================================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;