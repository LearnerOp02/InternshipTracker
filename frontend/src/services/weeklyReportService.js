import api from "./api";

export const createWeeklyReport = async (data) => {
  const response = await api.post(
    "/weekly-reports",
    data
  );

  return response.data;
};

export const getMyWeeklyReports = async () => {
  const response = await api.get(
    "/weekly-reports/my"
  );

  return response.data;
};