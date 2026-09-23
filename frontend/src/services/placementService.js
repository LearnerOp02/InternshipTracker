import api from "./api";


// ==========================================
// COMPANY MANAGEMENT
// ==========================================

// GET COMPANIES
export const getCompanies = async () => {
  const response = await api.get(
    "/companies"
  );

  return response.data;
};


// APPROVE COMPANY
export const approveCompany = async (
  companyId
) => {
  const response = await api.patch(
    `/companies/${companyId}/approve`
  );

  return response.data;
};


// ==========================================
// INTERNSHIP MANAGEMENT
// ==========================================

// GET PENDING INTERNSHIPS
export const getPendingInternships = async () => {
  const response = await api.get(
    "/internships/pending"
  );

  return response.data;
};


// APPROVE INTERNSHIP
export const approveInternship = async (
  internshipId
) => {
  const response = await api.patch(
    `/internships/${internshipId}/approve`
  );

  return response.data;
};


// REJECT INTERNSHIP
export const rejectInternship = async (
  internshipId,
  rejectionReason
) => {
  const response = await api.patch(
    `/internships/${internshipId}/reject`,
    {
      rejectionReason,
    }
  );

  return response.data;
};


// PUBLISH INTERNSHIP
export const publishInternship = async (
  internshipId
) => {
  const response = await api.patch(
    `/internships/${internshipId}/publish`
  );

  return response.data;
};

// GET APPROVED INTERNSHIPS
export const getApprovedInternships = async () => {
  const response = await api.get(
    "/internships/approved"
  );

  return response.data;
};

// ==========================================
// STUDENT MANAGEMENT
// ==========================================

export const getAllStudents = async () => {
  const response = await api.get(
    "/students/all"
  );

  return response.data;
};

// ==========================================
// APPLICATION MANAGEMENT
// ==========================================

export const getAllApplications = async () => {
  const response = await api.get(
    "/applications/all"
  );

  return response.data;
};

// ==========================================
// DOCUMENT MANAGEMENT
// ==========================================

export const getAllDocuments = async () => {
  const response = await api.get(
    "/documents/all"
  );

  return response.data;
};


export const verifyDocument = async (
  documentId
) => {
  const response = await api.patch(
    `/documents/${documentId}/verify`
  );

  return response.data;
};


export const rejectDocument = async (
  documentId,
  rejectionReason
) => {
  const response = await api.patch(
    `/documents/${documentId}/reject`,
    {
      rejectionReason,
    }
  );

  return response.data;
};

// ==========================================
// INTERNSHIP MONITORING
// ==========================================

export const getInternshipMonitoring =
  async () => {
    const response = await api.get(
      "/internships/monitoring"
    );

    return response.data;
  };

// ==========================================
// REPORTS & ANALYTICS
// ==========================================

export const getPlacementReports =
  async () => {
    const response = await api.get(
      "/placement/reports"
    );

    return response.data;
  };

// ==========================================
// AUDIT LOGS
// ==========================================

export const getAuditLogs = async () => {
  const response = await api.get(
    "/audit-logs"
  );

  return response.data;
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getPlacementNotifications =
  async () => {
    const response = await api.get(
      "/notifications/my"
    );

    return response.data;
  };


export const markPlacementNotificationRead =
  async (notificationId) => {
    const response = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  };


export const markAllPlacementNotificationsRead =
  async () => {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  };