import api from "./api";


// ==========================================
// STUDENT
// ==========================================

// GET LOGGED-IN STUDENT TASKS
export const getMyTasks = async () => {
  const response = await api.get(
    "/tasks/my"
  );

  return response.data;
};


// UPDATE STUDENT TASK STATUS
export const updateTask = async (
  taskId,
  data
) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    data
  );

  return response.data;
};


// ==========================================
// COMPANY
// ==========================================

// CREATE TASK
export const createTask = async (
  data
) => {
  const response = await api.post(
    "/tasks",
    data
  );

  return response.data;
};


// GET TASKS FOR INTERNSHIP
export const getCompanyTasks = async (
  internshipId
) => {
  const response = await api.get(
    `/tasks/internship/${internshipId}`
  );

  return response.data;
};


// UPDATE TASK
export const updateCompanyTask = async (
  taskId,
  data
) => {
  const response = await api.put(
    `/tasks/${taskId}`,
    data
  );

  return response.data;
};

export const deleteTask = async (
  taskId
) => {
  const response = await api.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};