import { NavLink } from "react-router-dom";

const Sidebar = ({
  title,
  links,
}) => {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-blue-600">
          {title}
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;