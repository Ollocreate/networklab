const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile/student", authMiddleware(["student"]), authController.getProfile);
router.get("/profile/teacher", authMiddleware(["teacher"]), authController.getProfile)

module.exports = router;
