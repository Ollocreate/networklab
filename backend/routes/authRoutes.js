const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/student", authMiddleware(["student"]), getProfile);
router.get("/profile/teacher", authMiddleware(["teacher"]), getProfile);

module.exports = router;
