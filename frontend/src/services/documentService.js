import api from "./api";

export const getMyDocuments = async () => {
  const response = await api.get(
    "/documents/my"
  );

  return response.data;
};

export const uploadDocument = async (
  formData
) => {
  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};