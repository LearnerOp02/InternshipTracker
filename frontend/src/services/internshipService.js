import api from "./api";


// ==========================================
// STUDENT ROUTES
// ==========================================

export const getPublishedInternships = async (
  params = {}
) => {
  const response = await api.get(
    "/internships",
    {
      params,
    }
  );

  return response.data;
};


export const getInternshipById = async (
  id
) => {
  const response = await api.get(
    `/internships/${id}`
  );

  return response.data;
};


export const checkInternshipEligibility = async (
  id
) => {
  const response = await api.get(
    `/internships/${id}/eligibility`
  );

  return response.data;
};


// ==========================================
// COMPANY ROUTES
// ==========================================

// GET COMPANY'S OWN INTERNSHIPS
export const getCompanyInternships = async () => {
  const response = await api.get(
    "/internships/my"
  );

  return response.data;
};


// GET SINGLE COMPANY INTERNSHIP
export const getCompanyInternshipById = async (
  id
) => {
  const response = await api.get(
    `/internships/my/${id}`
  );

  return response.data;
};


// CREATE INTERNSHIP
export const createInternship = async (
  data
) => {
  const response = await api.post(
    "/internships",
    data
  );

  return response.data;
};


// SUBMIT INTERNSHIP FOR APPROVAL
export const submitInternshipForApproval = async (
  internshipId
) => {
  const response = await api.patch(
    `/internships/${internshipId}/submit`
  );

  return response.data;
};


// UPDATE COMPANY INTERNSHIP
export const updateCompanyInternship = async (
  internshipId,
  data
) => {
  const response = await api.put(
    `/internships/${internshipId}`,
    data
  );

  return response.data;
};