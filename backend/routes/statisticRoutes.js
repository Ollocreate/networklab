const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCourseStatistic,
  getStatisticsForStudent,
  getStatisticsForCourseAndStudent,
} = require("../controllers/statisticController");

router.get(
  "/course/:courseId",
  authMiddleware(["teacher"]),
  getCourseStatistic
);

router.get(
  "/course/:courseId/student/:studentId",
  getStatisticsForCourseAndStudent
);

router.get("/student/:studentId", getStatisticsForStudent);

module.exports = router;
