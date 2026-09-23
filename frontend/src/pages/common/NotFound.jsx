import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">

      <div className="text-center">

        <h1 className="text-6xl font-bold text-slate-900">
          404
        </h1>

        <p className="mt-3 text-slate-500">
          Page not found
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Home
        </Link>

      </div>

    </div>
  );
};

export default NotFound;