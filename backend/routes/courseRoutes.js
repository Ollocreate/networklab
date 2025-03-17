const express = require("express");
const { getCourses, createCourse, getCoursesByUser } = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses);
router.get("/user/:userId", getCoursesByUser);
router.post("/", createCourse);

module.exports = router;
