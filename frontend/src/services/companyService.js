import api from "./api";

export const getMyCompanyProfile = async () => {
  const response = await api.get("/companies/me");
  return response.data;
};

export const updateMyCompanyProfile = async (data) => {
  const response = await api.put("/companies/me", data);
  return response.data;
};