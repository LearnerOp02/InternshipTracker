import api from "./api";

export const getMyInternshipProgress = async (
  internshipId
) => {
  const response = await api.get(
    `/progress/my/${internshipId}`
  );

  return response.data;
};