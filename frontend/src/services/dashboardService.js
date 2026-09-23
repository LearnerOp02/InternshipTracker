import api from "./api";

export const getStudentDashboard = async () => {
  const response = await api.get("/dashboard/student");
  return response.data;
};

export const getCompanyDashboard = async () => {
  const response = await api.get("/dashboard/company");
  return response.data;
};

export const getPlacementDashboard = async () => {
  const response = await api.get("/dashboard/placement");
  return response.data;
};