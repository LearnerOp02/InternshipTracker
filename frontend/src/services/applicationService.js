import api from "./api";

export const applyForInternship = async (
  internshipId,
  data = {}
) => {
  const response = await api.post(
    `/applications/internship/${internshipId}`,
    data
  );

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/my"
  );

  return response.data;
};

export const getMyApplicationById = async (
  applicationId
) => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

export const getSelectedApplication = async () => {
  const response = await api.get("/applications/my");

  const data = response.data;

  const applications =
    data.applications ||
    data.data ||
    data ||
    [];

  if (!Array.isArray(applications)) {
    return null;
  }

  return (
    applications.find(
      (application) =>
        application.status === "selected"
    ) || null
  );
};

export const getInternshipHistory = async () => {
  const response = await api.get("/applications/my");

  const data = response.data;

  const applications =
    data.applications ||
    data.data ||
    data ||
    [];

  if (!Array.isArray(applications)) {
    return [];
  }

  return applications.filter((application) => {
    const applicationStatus =
      application.status;

    const internshipStatus =
      application.internshipId?.status;

    return (
      applicationStatus === "rejected" ||
      internshipStatus === "completed" ||
      internshipStatus === "archived"
    );
  });
};

export const getCompanyApplicants = async (
  internshipId
) => {
  const response = await api.get(
    `/applications/internship/${internshipId}`
  );

  return response.data;
};


export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const getCompanyApplicationById = async (
  applicationId
) => {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data;
};

export const scheduleInterview = async (
  applicationId,
  data
) => {
  const response = await api.patch(
    `/applications/${applicationId}/interview`,
    data
  );

  return response.data;
};


export const selectStudent = async (
  applicationId,
  data = {}
) => {
  const response = await api.patch(
    `/applications/${applicationId}/select`,
    data
  );

  return response.data;
};

export const getSelectedStudentsForInternship =
  async (internshipId) => {
    const response = await api.get(
      `/applications/internship/${internshipId}`
    );

    const data =
      response.data;

    const applications =
      data.applications ||
      data.data ||
      data ||
      [];

    if (
      !Array.isArray(applications)
    ) {
      return [];
    }

    return applications.filter(
      (application) =>
        application.status ===
        "selected"
    );
  };