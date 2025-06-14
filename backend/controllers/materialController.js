const { Material, Course, Statistic, Task } = require("../models");
const { use } = require("../routes/courseRoutes");

exports.getMaterialsByCourse = async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ where: { slug } });
    if (!course) {
      return res.status(404).json({ error: "Курс не найден" });
    }

    const materials = await Material.findAll({
      where: { courseId: course.id },
      attributes: ["id", "title", "content", "parentId", "mediaUrls"],
    });
    res.json(materials);
    console.log("Материалы по курсу загружены");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id, {
      include: [
        {
          model: Task,
          as: "tasks", // Указываем алиас, соответствующий связи hasMany
          attributes: ["id", "name"], // Выбираем только нужные поля, например, id и title
        },
      ],
    });

    if (!material) return res.status(404).json({ error: "Материал не найден" });

    if (req.user) {
      const existingStat = await Statistic.findOne({
        where: {
          materialId: material.id,
          userId: req.user.id,
        },
      });

      if (!existingStat) {
        await Statistic.create({
          materialId: material.id,
          userId: req.user.id,
        });
        console.log("Уникальная статистика сохранена");
      } else {
        console.log(
          "Запись уже существует — статистика не сохраняется повторно"
        );
      }
    } else {
      console.log("Пользователь не авторизован");
    }

    res.json(material);
    console.log("Материал по id загружен");
  } catch (error) {
    console.error("Ошибка при получении материала:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserMaterials = async (req, res) => {
  try {
    const userId = req.params.userId;
    const materials = await Material.findAll({
      where: { userId },
    });
    res.json(materials);
  } catch (error) {
    console.error("Ошибка загрузки материалов пользователя:", error);
    res.status(500).json({ error: "Ошибка при загрузке материалов" });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await Material.findAll({
      attributes: ["id", "title", "courseId"],
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
    const userId = req.user.id;

    if (!title || !content || !courseId) {
      return res
        .status(400)
        .json({ error: "Необходимо передать title, content и courseId" });
    }

    const course = await Course.findByPk(Number(courseId));
    if (!course) {
      return res.status(400).json({ error: "Выбранный курс не существует" });
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    }));

    console.log("Сохранение в БД mediaUrls:", uploadedFiles);

    const newMaterial = await Material.create({
      title,
      content,
      courseId: Number(courseId),
      parentId: parentId ? Number(parentId) : null,
      order: 0,
      mediaUrls:
        uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      userId,
    });

    return res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Ошибка при создании материала:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Ошибка при создании материала" });
    }
  }
};
