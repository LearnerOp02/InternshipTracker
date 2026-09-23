import {
  useEffect,
  useState,
} from "react";

import {
  getCompanyInternships,
} from "../../services/internshipService";

import {
  getSelectedStudentsForInternship,
} from "../../services/applicationService";

import {
  createEvaluation,
  getInternshipEvaluations,
} from "../../services/evaluationService";


const CompanyEvaluations = () => {
  const [internships, setInternships] =
    useState([]);

  const [selectedInternship, setSelectedInternship] =
    useState("");

  const [students, setStudents] =
    useState([]);

  const [evaluations, setEvaluations] =
    useState([]);

  const [formData, setFormData] =
    useState({
      studentId: "",
      technicalSkills: 5,
      communication: 5,
      punctuality: 5,
      teamwork: 5,
      problemSolving: 5,
      overallRating: 5,
      feedback: "",
      recommendation: "recommended",
    });

  const [loading, setLoading] =
    useState(true);

  const [loadingData, setLoadingData] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD INTERNSHIPS
  // ==========================================

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCompanyInternships();

        const internshipList =
          data.internships ||
          data.data ||
          data ||
          [];

        const safeList =
          Array.isArray(internshipList)
            ? internshipList
            : [];

        setInternships(
          safeList
        );

        if (safeList.length > 0) {
          setSelectedInternship(
            safeList[0]._id
          );
        }

      } catch (error) {
        console.error(
          "Load internships error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internships"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);


  // ==========================================
  // LOAD STUDENTS + EVALUATIONS
  // ==========================================

  useEffect(() => {
    if (!selectedInternship) {
      return;
    }

    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");
        setSuccess("");

        const [
          studentData,
          evaluationData,
        ] = await Promise.all([
          getSelectedStudentsForInternship(
            selectedInternship
          ),

          getInternshipEvaluations(
            selectedInternship
          ),
        ]);

        setStudents(
          Array.isArray(studentData)
            ? studentData
            : []
        );

        const evaluationList =
          evaluationData.evaluations ||
          evaluationData.data ||
          evaluationData ||
          [];

        setEvaluations(
          Array.isArray(evaluationList)
            ? evaluationList
            : []
        );

        setFormData((previous) => ({
          ...previous,
          studentId: "",
        }));

      } catch (error) {
        console.error(
          "Load evaluation data error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load evaluation data"
        );

        setStudents([]);
        setEvaluations([]);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();

  }, [selectedInternship]);


  // ==========================================
  // HANDLE FORM
  // ==========================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]:
          [
            "technicalSkills",
            "communication",
            "punctuality",
            "teamwork",
            "problemSolving",
            "overallRating",
          ].includes(name)
            ? Number(value)
            : value,
      })
    );
  };


  // ==========================================
  // SUBMIT EVALUATION
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const selectedApplication =
        students.find(
          (application) =>
            getStudentId(
              application
            ) ===
            formData.studentId
        );

      if (!selectedApplication) {
        setError(
          "Please select a student."
        );

        return;
      }

      const alreadyEvaluated =
        evaluations.some(
          (evaluation) =>
            getEvaluationStudentId(
              evaluation
            ) ===
            formData.studentId
        );

      if (alreadyEvaluated) {
        setError(
          "This student has already been evaluated."
        );

        return;
      }

      const payload = {
        internshipId:
          selectedInternship,

        applicationId:
          selectedApplication._id,

        studentId:
          formData.studentId,

        technicalSkills:
          formData.technicalSkills,

        communication:
          formData.communication,

        punctuality:
          formData.punctuality,

        teamwork:
          formData.teamwork,

        problemSolving:
          formData.problemSolving,

        overallRating:
          formData.overallRating,

        feedback:
          formData.feedback.trim(),

        recommendation:
          formData.recommendation,
      };

      const data =
        await createEvaluation(
          payload
        );

      const newEvaluation =
        data.evaluation ||
        data.data ||
        data;

      setEvaluations(
        (previous) => [
          newEvaluation,
          ...previous,
        ]
      );

      setFormData({
        studentId: "",
        technicalSkills: 5,
        communication: 5,
        punctuality: 5,
        teamwork: 5,
        problemSolving: 5,
        overallRating: 5,
        feedback: "",
        recommendation: "recommended",
      });

      setSuccess(
        "Student evaluation submitted successfully."
      );

    } catch (error) {
      console.error(
        "Evaluation create error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit evaluation"
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Evaluations
        </h1>

        <p className="mt-1 text-slate-500">
          Evaluate internship students and
          record their performance.
        </p>

      </div>


      {/* SELECT INTERNSHIP */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Select Internship
        </label>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading internships...
          </p>
        ) : internships.length === 0 ? (
          <p className="text-sm text-slate-500">
            No internships found.
          </p>
        ) : (
          <select
            value={
              selectedInternship
            }
            onChange={(event) =>
              setSelectedInternship(
                event.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-xl"
          >
            {internships.map(
              (internship) => (
                <option
                  key={
                    internship._id
                  }
                  value={
                    internship._id
                  }
                >
                  {internship.title}
                  {" — "}
                  {internship.status?.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>
        )}

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* STATS */}

      {selectedInternship &&
        !loadingData && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            <StatCard
              title="Selected Students"
              value={
                students.length
              }
            />

            <StatCard
              title="Evaluated"
              value={
                evaluations.length
              }
            />

            <StatCard
              title="Pending Evaluation"
              value={Math.max(
                students.length -
                  evaluations.length,
                0
              )}
            />

          </div>
        )}


      {/* EVALUATION FORM */}

      {selectedInternship && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Evaluate Student
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Score the student's internship
            performance.
          </p>


          {loadingData ? (
            <p className="mt-5 text-sm text-slate-500">
              Loading students...
            </p>
          ) : students.length === 0 ? (
            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              No selected students available
              for evaluation.
            </div>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6"
            >

              {/* STUDENT */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Student
                </label>

                <select
                  name="studentId"
                  value={
                    formData.studentId
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Select student
                  </option>

                  {students.map(
                    (
                      application
                    ) => (
                      <option
                        key={
                          application._id
                        }
                        value={
                          getStudentId(
                            application
                          )
                        }
                      >
                        {getStudentName(
                          application
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* RATINGS */}

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                <RatingField
                  label="Technical Skills"
                  name="technicalSkills"
                  value={
                    formData.technicalSkills
                  }
                  onChange={
                    handleChange
                  }
                />

                <RatingField
                  label="Communication"
                  name="communication"
                  value={
                    formData.communication
                  }
                  onChange={
                    handleChange
                  }
                />

                <RatingField
                  label="Punctuality"
                  name="punctuality"
                  value={
                    formData.punctuality
                  }
                  onChange={
                    handleChange
                  }
                />

                <RatingField
                  label="Teamwork"
                  name="teamwork"
                  value={
                    formData.teamwork
                  }
                  onChange={
                    handleChange
                  }
                />

                <RatingField
                  label="Problem Solving"
                  name="problemSolving"
                  value={
                    formData.problemSolving
                  }
                  onChange={
                    handleChange
                  }
                />

                <RatingField
                  label="Overall Rating"
                  name="overallRating"
                  value={
                    formData.overallRating
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* FEEDBACK */}

              <div className="mt-6">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Feedback
                </label>

                <textarea
                  name="feedback"
                  value={
                    formData.feedback
                  }
                  onChange={
                    handleChange
                  }
                  required
                  rows="5"
                  placeholder="Write feedback about the student's performance..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* RECOMMENDATION */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Recommendation
                </label>

                <select
                  name="recommendation"
                  value={
                    formData.recommendation
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:max-w-xl"
                >

                  <option value="highly_recommended">
                    Highly Recommended
                  </option>

                  <option value="recommended">
                    Recommended
                  </option>

                  <option value="needs_improvement">
                    Needs Improvement
                  </option>

                  <option value="not_recommended">
                    Not Recommended
                  </option>

                </select>

              </div>


              <div className="mt-6 flex justify-end">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Submitting..."
                    : "Submit Evaluation"}
                </button>

              </div>

            </form>
          )}

        </div>
      )}


      {/* EVALUATIONS LIST */}

      {selectedInternship && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <h2 className="text-xl font-semibold text-slate-900">
              Submitted Evaluations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review previous student evaluations.
            </p>

          </div>


          {loadingData ? (
            <div className="p-6 text-sm text-slate-500">
              Loading evaluations...
            </div>
          ) : evaluations.length === 0 ? (
            <div className="p-10 text-center">

              <h3 className="font-semibold text-slate-900">
                No evaluations yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Submitted evaluations will appear here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-200">

              {evaluations.map(
                (evaluation) => (
                  <EvaluationCard
                    key={
                      evaluation._id
                    }
                    evaluation={
                      evaluation
                    }
                  />
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};


// ==========================================
// RATING FIELD
// ==========================================

const RatingField = ({
  label,
  name,
  value,
  onChange,
}) => (
  <div>

    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >

      <option value="1">
        1 - Poor
      </option>

      <option value="2">
        2 - Fair
      </option>

      <option value="3">
        3 - Good
      </option>

      <option value="4">
        4 - Very Good
      </option>

      <option value="5">
        5 - Excellent
      </option>

    </select>

  </div>
);


// ==========================================
// EVALUATION CARD
// ==========================================

const EvaluationCard = ({
  evaluation,
}) => {
  const student =
    evaluation.studentId ||
    evaluation.student ||
    {};

  const user =
    student.userId ||
    student.user ||
    {};

  return (
    <div className="p-6">

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            {student.name ||
              user.name ||
              evaluation.studentName ||
              "Student"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Evaluated on{" "}
            {formatDate(
              evaluation.createdAt
            )}
          </p>

        </div>


        <RecommendationBadge
          recommendation={
            evaluation.recommendation
          }
        />

      </div>


      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Score
          label="Technical Skills"
          value={
            evaluation.technicalSkills
          }
        />

        <Score
          label="Communication"
          value={
            evaluation.communication
          }
        />

        <Score
          label="Punctuality"
          value={
            evaluation.punctuality
          }
        />

        <Score
          label="Teamwork"
          value={
            evaluation.teamwork
          }
        />

        <Score
          label="Problem Solving"
          value={
            evaluation.problemSolving
          }
        />

        <Score
          label="Overall Rating"
          value={
            evaluation.overallRating
          }
        />

      </div>


      {evaluation.feedback && (
        <div className="mt-5">

          <p className="text-sm font-medium text-slate-700">
            Feedback
          </p>

          <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {evaluation.feedback}
          </div>

        </div>
      )}

    </div>
  );
};


// ==========================================
// SCORE
// ==========================================

const Score = ({
  label,
  value,
}) => (
  <div className="rounded-xl bg-slate-50 p-4">

    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-lg font-semibold text-slate-900">
      {value ?? "N/A"}
      {value !== undefined &&
        value !== null &&
        " / 5"}
    </p>

  </div>
);


// ==========================================
// RECOMMENDATION BADGE
// ==========================================

const RecommendationBadge = ({
  recommendation,
}) => {
  const value =
    recommendation ||
    "recommended";

  const styles = {
    highly_recommended:
      "bg-green-100 text-green-800",

    recommended:
      "bg-blue-100 text-blue-800",

    needs_improvement:
      "bg-yellow-100 text-yellow-800",

    not_recommended:
      "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`self-start rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[value] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {value.replaceAll(
        "_",
        " "
      )}
    </span>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
  title,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

    <p className="text-sm text-slate-500">
      {title}
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      {value}
    </p>

  </div>
);


// ==========================================
// STUDENT HELPERS
// ==========================================

const getStudentId = (
  application
) => {
  const student =
    application.studentId ||
    application.student;

  if (
    typeof student ===
    "string"
  ) {
    return student;
  }

  return (
    student?._id ||
    ""
  );
};


const getStudentName = (
  application
) => {
  const student =
    application.studentId ||
    application.student ||
    {};

  const user =
    student.userId ||
    student.user ||
    {};

  return (
    student.name ||
    user.name ||
    application.studentName ||
    "Student"
  );
};


const getEvaluationStudentId = (
  evaluation
) => {
  const student =
    evaluation.studentId ||
    evaluation.student;

  if (
    typeof student ===
    "string"
  ) {
    return student;
  }

  return (
    student?._id ||
    ""
  );
};


// ==========================================
// DATE
// ==========================================

const formatDate = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "N/A";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


export default CompanyEvaluations;