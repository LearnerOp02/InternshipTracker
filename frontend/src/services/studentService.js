import api from "./api";

export const getMyStudentProfile = async () => {
  const response = await api.get("/students/me");
  return response.data;
};

export const updateMyStudentProfile = async (data) => {
  const response = await api.put("/students/me", data);
  return response.data;
};