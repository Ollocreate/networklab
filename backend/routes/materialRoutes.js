const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const upload = require("../middleware/uploadMiddleware");

// Создать новый материал
router.post("/", upload.array("media", 5), materialController.createMaterial);

// Получить все материалы по курсу
router.get("/course/:courseId", materialController.getMaterialsByCourse);

// Получить список тем (разделов)
router.get("/topics", materialController.getTopics);

// Получить материал по ID
router.get("/:id", materialController.getMaterialById);

module.exports = router;
