const { Statistic, Material, User, Course, UserCourses } = require("../models");

exports.getCourseStatistic = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId, {
      include: {
        model: User,
        as: "users",
        attributes: ["id", "username", "email"],
        through: { attributes: [] },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Курс не найден" });
    }

    const studentIds = course.users.map((user) => user.id);

    const materials = await Material.findAll({
      where: { courseId },
      attributes: ["id"],
    });

    const materialIds = materials.map((m) => m.id);

    const statistics = await Statistic.findAll({
      where: {
        userId: studentIds,
        materialId: materialIds,
      },
    });

    res.json({
      students: course.users,
      statistics,
    });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);
    res.status(500).json({ error: "Ошибка получения статистики" });
  }
};
exports.getStatisticsForCourseAndStudent = async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const course = await Course.findByPk(courseId, {
      include: {
        model: User,
        as: "users",
        attributes: ["id", "username", "email"],
        through: { attributes: [] },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Курс не найден" });
    }

    const student = course.users.find(
      (user) => user.id === parseInt(studentId)
    );

    if (!student) {
      return res.status(404).json({ error: "Студент не записан на этот курс" });
    }

    const totalMaterials = await Material.count({
      where: { courseId },
    });

    const materials = await Material.findAll({
      where: { courseId },
      attributes: ["id"],
    });

    const materialIds = materials.map((m) => m.id);

    const statistics = await Statistic.findAll({
      where: {
        userId: studentId,
        materialId: materialIds,
      },
    });

    res.json({
      student,
      statistics,
      totalMaterials,
    });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);
    res.status(500).json({ error: "Ошибка получения статистики" });
  }
};

// Получить статистику по студенту для всех курсов
exports.getStatisticsForStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Получаем пользователя с курсами и материалами
    const user = await User.findByPk(studentId, {
      include: {
        model: Course,
        as: "courses",
        attributes: ["id", "title"],
        through: { attributes: [] },
        include: {
          model: Material,
          attributes: ["id"],
        },
      },
    });

    if (!user || user.courses.length === 0) {
      return res.status(404).json({ error: "Студент не записан на курсы" });
    }

    // Собираем все доступные студенту materialId
    const materialIds = user.courses.flatMap((course) =>
      course.Materials.map((m) => m.id)
    );

    // Получаем статистику по этим материалам
    const statistics = await Statistic.findAll({
      where: {
        userId: studentId,
        materialId: materialIds,
      },
    });

    res.json({ statistics });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);
    res.status(500).json({ error: "Ошибка получения статистики" });
  }
};
