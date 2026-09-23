import {
  useEffect,
  useState,
} from "react";

import {
  getCompanyInternships,
} from "../../services/internshipService";

import {
  getSelectedStudentsForInternship,
} from "../../services/applicationService";

import {
  createTask,
  getCompanyTasks,
  deleteTask,
} from "../../services/taskService";


const CompanyTasks = () => {
  const [internships, setInternships] =
    useState([]);

  const [selectedInternship, setSelectedInternship] =
    useState("");

  const [students, setStudents] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [formData, setFormData] =
    useState({
      studentId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    });

  const [loading, setLoading] =
    useState(true);

  const [loadingData, setLoadingData] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD COMPANY INTERNSHIPS
  // ==========================================

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCompanyInternships();

        const internshipList =
          data.internships ||
          data.data ||
          data ||
          [];

        const safeList =
          Array.isArray(
            internshipList
          )
            ? internshipList
            : [];

        setInternships(
          safeList
        );

        if (
          safeList.length > 0
        ) {
          setSelectedInternship(
            safeList[0]._id
          );
        }

      } catch (error) {
        console.error(
          "Load internships error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internships"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);


  // ==========================================
  // LOAD SELECTED STUDENTS + TASKS
  // ==========================================

  useEffect(() => {
    if (!selectedInternship) {
      return;
    }

    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");
        setSuccess("");

        const [
          studentApplications,
          taskData,
        ] =
          await Promise.all([
            getSelectedStudentsForInternship(
              selectedInternship
            ),

            getCompanyTasks(
              selectedInternship
            ),
          ]);

        setStudents(
          Array.isArray(
            studentApplications
          )
            ? studentApplications
            : []
        );

        const taskList =
          taskData.tasks ||
          taskData.data ||
          taskData ||
          [];

        setTasks(
          Array.isArray(
            taskList
          )
            ? taskList
            : []
        );

        setFormData(
          (previous) => ({
            ...previous,
            studentId: "",
          })
        );

      } catch (error) {
        console.error(
          "Load tasks error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internship task data"
        );

        setTasks([]);
        setStudents([]);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();

  }, [selectedInternship]);


  // ==========================================
  // HANDLE FORM
  // ==========================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !selectedInternship
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const selectedApplication =
        students.find(
          (application) =>
            getStudentId(
              application
            ) ===
            formData.studentId
        );

      if (
        !selectedApplication
      ) {
        setError(
          "Please select a student."
        );

        return;
      }

      const payload = {
        internshipId:
          selectedInternship,

        studentId:
          formData.studentId,

        applicationId:
          selectedApplication._id,

        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        dueDate:
          formData.dueDate,

        priority:
          formData.priority,
      };

      const data =
        await createTask(
          payload
        );

      const newTask =
        data.task ||
        data.data ||
        data;

      setTasks(
        (previous) => [
          newTask,
          ...previous,
        ]
      );

      setFormData({
        studentId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });

      setSuccess(
        "Task assigned successfully."
      );

    } catch (error) {
      console.error(
        "Create task error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to assign task"
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (
    taskId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        taskId
      );

      setError("");
      setSuccess("");

      await deleteTask(
        taskId
      );

      setTasks(
        (previous) =>
          previous.filter(
            (task) =>
              task._id !==
              taskId
          )
      );

      setSuccess(
        "Task deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    } finally {
      setDeletingId(null);
    }
  };


  // ==========================================
  // STATS
  // ==========================================

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status ===
          "pending" ||
        task.status ===
          "assigned"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "in_progress"
    ).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Tasks
        </h1>

        <p className="mt-1 text-slate-500">
          Assign and monitor tasks for
          selected internship students.
        </p>

      </div>


      {/* SELECT INTERNSHIP */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Select Internship
        </label>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading internships...
          </p>
        ) : internships.length === 0 ? (
          <p className="text-sm text-slate-500">
            No internships found.
          </p>
        ) : (
          <select
            value={
              selectedInternship
            }
            onChange={(event) =>
              setSelectedInternship(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-xl"
          >

            {internships.map(
              (internship) => (
                <option
                  key={
                    internship._id
                  }
                  value={
                    internship._id
                  }
                >
                  {internship.title}
                  {" — "}
                  {internship.status?.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}

          </select>
        )}

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* STATS */}

      {selectedInternship &&
        !loadingData && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Selected Students"
              value={
                students.length
              }
            />

            <StatCard
              title="Pending"
              value={
                pendingTasks
              }
            />

            <StatCard
              title="In Progress"
              value={
                inProgressTasks
              }
            />

            <StatCard
              title="Completed"
              value={
                completedTasks
              }
            />

          </div>
        )}


      {/* ASSIGN TASK */}

      {selectedInternship && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Assign New Task
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a task for a selected student.
          </p>


          {loadingData ? (
            <p className="mt-5 text-sm text-slate-500">
              Loading selected students...
            </p>
          ) : students.length ===
            0 ? (
            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              No selected students are available
              for this internship.
            </div>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* STUDENT */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Student
                  </label>

                  <select
                    name="studentId"
                    value={
                      formData.studentId
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >

                    <option value="">
                      Select student
                    </option>

                    {students.map(
                      (
                        application
                      ) => {
                        const name =
                          getStudentName(
                            application
                          );

                        const studentId =
                          getStudentId(
                            application
                          );

                        return (
                          <option
                            key={
                              application._id
                            }
                            value={
                              studentId
                            }
                          >
                            {name}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>


                {/* TITLE */}

                <InputField
                  label="Task Title"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Complete authentication module"
                  required
                />


                {/* DUE DATE */}

                <InputField
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={
                    formData.dueDate
                  }
                  onChange={
                    handleChange
                  }
                  required
                />


                {/* PRIORITY */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      formData.priority
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Task Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  required
                  rows="5"
                  placeholder="Describe what the student needs to complete..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              <div className="mt-6 flex justify-end">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Assigning..."
                    : "Assign Task"}
                </button>

              </div>

            </form>
          )}

        </div>
      )}


      {/* TASK LIST */}

      {selectedInternship && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <h2 className="text-xl font-semibold text-slate-900">
              Assigned Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitor student task progress.
            </p>

          </div>


          {loadingData ? (
            <div className="p-6 text-sm text-slate-500">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-10 text-center">

              <h3 className="font-semibold text-slate-900">
                No tasks assigned
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Assigned tasks will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-200">

              {tasks.map(
                (task) => (
                  <TaskCard
                    key={
                      task._id
                    }
                    task={
                      task
                    }
                    deleting={
                      deletingId ===
                      task._id
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                )
              )}

            </div>
          )}

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
  deleting,
  onDelete,
}) => {
  const student =
    task.studentId ||
    task.student ||
    {};

  const user =
    student.userId ||
    student.user ||
    {};

  return (
    <div className="p-6">

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

        <div>

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="text-lg font-semibold text-slate-900">
              {task.title}
            </h3>

            <PriorityBadge
              priority={
                task.priority
              }
            />

            <StatusBadge
              status={
                task.status
              }
            />

          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {task.description}
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            onDelete(
              task._id
            )
          }
          disabled={deleting}
          className="self-start rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>

      </div>


      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Info
          label="Student"
          value={
            student.name ||
            user.name ||
            task.studentName
          }
        />

        <Info
          label="Due Date"
          value={formatDate(
            task.dueDate
          )}
        />

        <Info
          label="Assigned On"
          value={formatDate(
            task.createdAt
          )}
        />

        <Info
          label="Status"
          value={
            task.status?.replaceAll(
              "_",
              " "
            )
          }
        />

      </div>

    </div>
  );
};


// ==========================================
// INPUT
// ==========================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>

    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

  </div>
);


// ==========================================
// INFO
// ==========================================

const Info = ({
  label,
  value,
}) => (
  <div>

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 font-medium text-slate-800">
      {value ??
        "N/A"}
    </p>

  </div>
);


// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
  title,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      {value}
    </p>

  </div>
);


// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({
  status,
}) => {
  const value =
    status || "pending";

  const styles = {
    pending:
      "bg-slate-100 text-slate-700",

    assigned:
      "bg-blue-50 text-blue-700",

    in_progress:
      "bg-yellow-50 text-yellow-700",

    completed:
      "bg-green-50 text-green-700",

    overdue:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[value] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {value.replaceAll(
        "_",
        " "
      )}
    </span>
  );
};


// ==========================================
// PRIORITY BADGE
// ==========================================

const PriorityBadge = ({
  priority,
}) => {
  const value =
    priority || "medium";

  const styles = {
    low:
      "bg-green-50 text-green-700",

    medium:
      "bg-yellow-50 text-yellow-700",

    high:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[value] ||
        styles.medium
      }`}
    >
      {value}
    </span>
  );
};


// ==========================================
// STUDENT HELPERS
// ==========================================

const getStudentId = (
  application
) => {
  const student =
    application.studentId ||
    application.student;

  if (
    typeof student ===
    "string"
  ) {
    return student;
  }

  return (
    student?._id ||
    application.studentId?._id ||
    ""
  );
};


const getStudentName = (
  application
) => {
  const student =
    application.studentId ||
    application.student ||
    {};

  const user =
    student.userId ||
    student.user ||
    {};

  return (
    student.name ||
    user.name ||
    application.studentName ||
    "Student"
  );
};


// ==========================================
// DATE
// ==========================================

const formatDate = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "N/A";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


export default CompanyTasks;