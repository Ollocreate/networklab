const express = require("express");
const {
  getUsers,
  getCoursesForStudent,
  enrollStudent,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId/courses", getCoursesForStudent);
router.post("/enroll", enrollStudent);

module.exports = router;
