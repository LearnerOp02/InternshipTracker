/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  getMyTasks,
  updateTask,
} from "../../services/taskService";

const StudentTasks = () => {
  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);


  // ==========================================
  // LOAD TASKS
  // ==========================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyTasks();

      const taskList =
        data.tasks ||
        data.data ||
        data ||
        [];

      setTasks(
        Array.isArray(taskList)
          ? taskList
          : []
      );
    } catch (error) {
      console.error(
        "Load tasks error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTasks();
  }, []);


  // ==========================================
  // UPDATE TASK STATUS
  // ==========================================

  const handleStatusChange = async (
    taskId,
    status
  ) => {
    try {
      setUpdatingId(taskId);
      setError("");

      await updateTask(
        taskId,
        {
          status,
        }
      );

      setTasks((previous) =>
        previous.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status,
              }
            : task
        )
      );
    } catch (error) {
      console.error(
        "Task update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update task"
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // TASK STATISTICS
  // ==========================================

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

  const ongoingTasks =
    tasks.filter(
      (task) =>
        task.status === "ongoing" ||
        task.status === "in_progress"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status === "pending" ||
        task.status === "not_started"
    ).length;


  return (
    <div>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          My Tasks
        </h1>

        <p className="mt-1 text-slate-500">
          View and manage your internship
          tasks.
        </p>

      </div>


      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* ================================= */}
      {/* STATISTICS */}
      {/* ================================= */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <TaskStatCard
            title="Total Tasks"
            value={totalTasks}
          />

          <TaskStatCard
            title="Pending"
            value={pendingTasks}
          />

          <TaskStatCard
            title="Ongoing"
            value={ongoingTasks}
          />

          <TaskStatCard
            title="Completed"
            value={completedTasks}
          />

        </div>
      )}


      {/* ================================= */}
      {/* TASK LIST */}
      {/* ================================= */}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            No tasks assigned
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your company has not assigned
            any internship tasks yet.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              updating={
                updatingId === task._id
              }
              onStatusChange={
                handleStatusChange
              }
            />
          ))}

        </div>
      )}

    </div>
  );
};


// ==========================================
// TASK CARD
// ==========================================

const TaskCard = ({
  task,
  updating,
  onStatusChange,
}) => {
  const internship =
    task.internshipId;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) <
      new Date() &&
    task.status !== "completed";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

        {/* LEFT */}

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-xl font-semibold text-slate-900">
              {task.title}
            </h2>

            <TaskStatusBadge
              status={task.status}
            />

            {isOverdue && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                Overdue
              </span>
            )}

          </div>


          {internship?.title && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              {internship.title}
            </p>
          )}


          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
            {task.description ||
              "No task description provided."}
          </p>


          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">

            <TaskDetail
              label="Assigned Date"
              value={formatDate(
                task.createdAt
              )}
            />

            <TaskDetail
              label="Due Date"
              value={formatDate(
                task.dueDate
              )}
            />

            {task.priority && (
              <TaskDetail
                label="Priority"
                value={task.priority}
              />
            )}

          </div>

        </div>


        {/* STATUS UPDATE */}

        <div className="w-full rounded-xl bg-slate-50 p-4 lg:w-56">

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Task Status
          </label>

          <select
            value={
              normalizeTaskStatus(
                task.status
              )
            }
            disabled={updating}
            onChange={(event) =>
              onStatusChange(
                task._id,
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >

            <option value="not_started">
              Not Started
            </option>

            <option value="ongoing">
              Ongoing
            </option>

            <option value="completed">
              Completed
            </option>

          </select>

          {updating && (
            <p className="mt-2 text-xs text-blue-600">
              Updating...
            </p>
          )}

        </div>

      </div>


      {/* PROGRESS */}

      <div className="mt-6 border-t border-slate-200 pt-5">

        <div className="mb-2 flex items-center justify-between">

          <p className="text-sm font-medium text-slate-600">
            Task Progress
          </p>

          <p className="text-sm font-semibold text-blue-600">
            {getTaskPercentage(
              task.status
            )}
            %
          </p>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${getTaskPercentage(
                task.status
              )}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
};


// ==========================================
// STATUS BADGE
// ==========================================

const TaskStatusBadge = ({
  status,
}) => {
  const normalized =
    normalizeTaskStatus(status);

  const styles = {
    not_started:
      "bg-slate-100 text-slate-700",

    ongoing:
      "bg-yellow-50 text-yellow-700",

    completed:
      "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[normalized]
      }`}
    >
      {normalized.replaceAll(
        "_",
        " "
      )}
    </span>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const TaskStatCard = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// DETAIL
// ==========================================

const TaskDetail = ({
  label,
  value,
}) => {
  return (
    <div>

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-medium capitalize text-slate-800">
        {value || "N/A"}
      </p>

    </div>
  );
};


// ==========================================
// NORMALIZE STATUS
// ==========================================

const normalizeTaskStatus = (
  status
) => {
  if (
    status === "pending"
  ) {
    return "not_started";
  }

  if (
    status === "in_progress"
  ) {
    return "ongoing";
  }

  return (
    status || "not_started"
  );
};


// ==========================================
// TASK PERCENTAGE
// ==========================================

const getTaskPercentage = (
  status
) => {
  const normalized =
    normalizeTaskStatus(status);

  if (
    normalized === "completed"
  ) {
    return 100;
  }

  if (
    normalized === "ongoing"
  ) {
    return 50;
  }

  return 0;
};


// ==========================================
// DATE FORMAT
// ==========================================

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleDateString();
};

export default StudentTasks;