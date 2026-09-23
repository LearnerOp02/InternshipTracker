import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

const companyLinks = [
  {
    label: "Dashboard",
    path: "/company/dashboard",
  },
  {
    label: "Company Profile",
    path: "/company/profile",
  },
  {
    label: "My Internships",
    path: "/company/internships",
  },
  {
    label: "Create Internship",
    path: "/company/internships/create",
  },
  {
    label: "Applicants",
    path: "/company/applicants",
  },
  {
    label: "Interviews",
    path: "/company/interviews",
  },
  {
    label: "Tasks",
    path: "/company/tasks",
  },
  {
    label: "Evaluations",
    path: "/company/evaluations",
  },
  {
    label: "Notifications",
    path: "/company/notifications",
  },
];

const CompanyLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        title="Company Portal"
        links={companyLinks}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar title="Company Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default CompanyLayout;