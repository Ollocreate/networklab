const { Material, Course, Op } = require("../models");

exports.getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.findAll({
      where: { courseId },
      order: [["order", "ASC"]],
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);

    if (!material) return res.status(404).json({ error: "Материал не найден" });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await Material.findAll({
      attributes: ["id", "title"], 
    });
    res.json(topics);
  } catch (error) {
    console.error("Ошибка при загрузке тем:", error);
    res.status(500).json({ error: "Ошибка загрузки тем" });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { title, content, parentId, courseId } = req.body;

    if (!title || !content || !courseId) {
      return res.status(400).json({ error: "Необходимо передать title, content и courseId" });
    }

    const course = await Course.findByPk(Number(courseId));
    if (!course) {
      return res.status(400).json({ error: "Выбранный курс не существует" });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    }));

    console.log("Сохранение в БД mediaUrls:", uploadedFiles);

    const newMaterial = await Material.create({
      title,
      content,
      courseId: Number(courseId),
      parentId: parentId ? Number(parentId) : null,
      order: 0,
      mediaUrls: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
    });

    return res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Ошибка при создании материала:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Ошибка при создании материала" });
    }
  }
};