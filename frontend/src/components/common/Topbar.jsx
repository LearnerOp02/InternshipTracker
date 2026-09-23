import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Topbar = ({ title }) => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">

      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>

        <p className="text-sm text-slate-500">
          {user?.email}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">
            {user?.name}
          </p>

          <p className="text-xs capitalize text-slate-500">
            {user?.role?.replace("_", " ")}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Topbar;