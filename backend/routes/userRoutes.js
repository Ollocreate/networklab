const express = require("express");
const { getUsers, getCoursesForStudent } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId/courses", getCoursesForStudent);

module.exports = router;
