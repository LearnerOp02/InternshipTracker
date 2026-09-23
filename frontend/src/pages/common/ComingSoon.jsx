const ComingSoon = ({ title }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        This module will be implemented in the upcoming frontend steps.
      </p>

    </div>
  );
};

export default ComingSoon;