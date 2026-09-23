import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

const studentLinks = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
  },
  {
    label: "My Profile",
    path: "/student/profile",
  },
  {
    label: "Browse Internships",
    path: "/student/internships",
  },
  {
    label: "My Applications",
    path: "/student/applications",
  },
  {
    label: "My Internship",
    path: "/student/my-internship",
  },
  {
    label: "Tasks",
    path: "/student/tasks",
  },
  {
    label: "Weekly Reports",
    path: "/student/weekly-reports",
  },
  {
    label: "Documents",
    path: "/student/documents",
  },
  {
    label: "Internship History",
    path: "/student/history",
  },
  {
    label: "Notifications",
    path: "/student/notifications",
  },
];

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar
        title="Internship Tracker"
        links={studentLinks}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar title="Student Portal" />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default StudentLayout;