const express = require("express");
const router = express.Router();
const {
  createMaterial,
  getMaterialsByCourse,
  getUserMaterials,
  getTopics,
  getMaterialById,
} = require("../controllers/materialController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware(["teacher"]),
  upload.array("media", 5),
  createMaterial
);
router.get("/course/:slug", getMaterialsByCourse);
router.get("/user/:userId", getUserMaterials);
router.get("/topics", getTopics);
router.get("/:id", authMiddleware(), getMaterialById);

module.exports = router;
