import api from "./api";


// ==========================================
// CREATE EVALUATION
// ==========================================

export const createEvaluation = async (
  data
) => {
  const response = await api.post(
    "/evaluations",
    data
  );

  return response.data;
};


// ==========================================
// UPDATE EVALUATION
// ==========================================

export const updateEvaluation = async (
  evaluationId,
  data
) => {
  const response = await api.put(
    `/evaluations/${evaluationId}`,
    data
  );

  return response.data;
};


// ==========================================
// GET INTERNSHIP EVALUATIONS
// ==========================================

export const getInternshipEvaluations = async (
  internshipId
) => {
  const response = await api.get(
    `/evaluations/internship/${internshipId}`
  );

  return response.data;
};