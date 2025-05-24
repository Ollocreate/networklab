const express = require("express");
const {
  getCourses,
  createCourse,
  getCoursesByUser,
  getStudentsForCourse
} = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/user/:userId", getCoursesByUser);
router.post("/", createCourse);
router.get('/:courseId/students', getStudentsForCourse);


module.exports = router;
