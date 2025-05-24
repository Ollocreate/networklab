const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCourseStatistic,
  getStatisticsForStudent,
  getStatisticsForCourseAndStudent
} = require("../controllers/statisticController");

router.get("/course/:courseId", authMiddleware(["teacher"]), getCourseStatistic);

// Получить статистику по студенту для конкретного курса
router.get('/course/:courseId/student/:studentId', getStatisticsForCourseAndStudent);
// Получить статистику по всем курсам для студента
router.get('/student/:studentId', getStatisticsForStudent);


module.exports = router;
