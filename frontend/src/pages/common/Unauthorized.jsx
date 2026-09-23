import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">

      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">
          403
        </h1>

        <h2 className="mt-3 text-2xl font-semibold">
          Access Denied
        </h2>

        <p className="mt-2 text-slate-500">
          You do not have permission to access this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Go Home
        </Link>
      </div>

    </div>
  );
};

export default Unauthorized;