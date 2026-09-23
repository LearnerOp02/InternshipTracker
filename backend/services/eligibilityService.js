const checkEligibility = (student, internship) => {
  const reasons = [];

  let eligible = true;

  // ==========================================
  // BRANCH CHECK
  // ==========================================
  if (
    internship.eligibility.branches.length > 0 &&
    !internship.eligibility.branches.includes(
      student.department
    )
  ) {
    eligible = false;

    reasons.push(
      `Branch requirement: ${internship.eligibility.branches.join(
        ", "
      )}`
    );
  }

  // ==========================================
  // YEAR CHECK
  // ==========================================
  if (
    internship.eligibility.eligibleYears.length > 0 &&
    !internship.eligibility.eligibleYears.includes(
      student.year
    )
  ) {
    eligible = false;

    reasons.push(
      `Eligible years: ${internship.eligibility.eligibleYears.join(
        ", "
      )}`
    );
  }

  // ==========================================
  // CGPA CHECK
  // ==========================================
  if (
    internship.eligibility.minimumCGPA !== undefined &&
    student.cgpa < internship.eligibility.minimumCGPA
  ) {
    eligible = false;

    reasons.push(
      `Minimum CGPA required: ${internship.eligibility.minimumCGPA}`
    );
  }

  // ==========================================
  // BACKLOG CHECK
  // ==========================================
  if (
    student.backlogs >
    internship.eligibility.maximumBacklogs
  ) {
    eligible = false;

    reasons.push(
      `Maximum backlogs allowed: ${internship.eligibility.maximumBacklogs}`
    );
  }

  // ==========================================
  // SKILLS CHECK
  // ==========================================
  const requiredSkills =
    internship.requiredSkills || [];

  const studentSkills = (student.skills || []).map(
    (skill) => skill.toLowerCase()
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !studentSkills.includes(skill.toLowerCase())
  );

  if (missingSkills.length > 0) {
    eligible = false;

    reasons.push(
      `Missing skills: ${missingSkills.join(", ")}`
    );
  }

  return {
    eligible,
    reasons,
    missingSkills,
  };
};

module.exports = checkEligibility;