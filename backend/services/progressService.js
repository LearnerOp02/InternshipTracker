const Task = require("../models/Task");
const WeeklyReport = require("../models/WeeklyReport");
const InternshipProgress = require("../models/InternshipProgress");

const calculateProgress = async (internshipId, studentId) => {
  const tasks = await Task.find({
    internshipId,
    studentId,
  });

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const totalTasks = tasks.length;

  const totalReports = await WeeklyReport.countDocuments({
    internshipId,
    studentId,
  });

  let percentage = 0;

  if (totalTasks > 0) {
    percentage = Math.round(
      (completedTasks / totalTasks) * 100
    );
  }

  let status = "not_started";

  if (percentage > 0 && percentage < 100) {
    status = "ongoing";
  }

  if (percentage === 100 && totalTasks > 0) {
    status = "completed";
  }

  const progress = await InternshipProgress.findOneAndUpdate(
    {
      internshipId,
      studentId,
    },
    {
      internshipId,
      studentId,
      status,
      percentage,
      totalTasks,
      completedTasks,
      totalReports,
      lastUpdated: new Date(),
      ...(status === "completed"
        ? { completedAt: new Date() }
        : { completedAt: undefined }),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return progress;
};

module.exports = {
  calculateProgress,
};