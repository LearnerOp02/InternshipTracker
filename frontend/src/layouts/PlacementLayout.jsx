import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

const placementLinks = [
  {
    label: "Dashboard",
    path: "/placement/dashboard",
  },

  // ==========================================
  // STUDENT MANAGEMENT
  // ==========================================
  {
    label: "Students",
    path: "/placement/students",
  },

  // ==========================================
  // COMPANY MANAGEMENT
  // ==========================================
  {
    label: "Companies",
    path: "/placement/companies",
  },
  {
    label: "Pending Companies",
    path: "/placement/companies/pending",
  },

  // ==========================================
  // INTERNSHIP MANAGEMENT
  // ==========================================
  {
    label: "Internships",
    path: "/placement/internships",
  },
  {
    label: "Pending Internships",
    path: "/placement/internships/pending",
  },
  {
    label: "Publish Internships",
    path: "/placement/internships/approved",
  },
  {
    label: "Internship Monitoring",
    path: "/placement/monitoring",
  },

  // ==========================================
  // APPLICATION MANAGEMENT
  // ==========================================
  {
    label: "Applications",
    path: "/placement/applications",
  },

  // ==========================================
  // DOCUMENT MANAGEMENT
  // ==========================================
  {
    label: "Documents",
    path: "/placement/documents",
  },

  // ==========================================
  // REPORTS
  // ==========================================
  {
    label: "Reports",
    path: "/placement/reports",
  },

  // ==========================================
  // SYSTEM
  // ==========================================
  {
    label: "Audit Logs",
    path: "/placement/audit-logs",
  },
  {
    label: "Notifications",
    path: "/placement/notifications",
  },
];

const PlacementLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        title="Placement Cell"
        links={placementLinks}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar title="Placement Cell Portal" />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default PlacementLayout;