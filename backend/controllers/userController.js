const { User, Course } = require("../models");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoursesForStudent = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Course,
        as: "courses",
        attributes: ["id", "title"],
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user.courses);
  } catch (err) {
    console.error("Ошибка при получении курсов студента:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.enrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;

  if (!studentId || !courseId) {
    return res.status(400).json({ error: "studentId и courseId обязательны" });
  }

  try {
    const user = await User.findByPk(studentId);
    const course = await Course.findByPk(courseId);

    if (!user || !course) {
      return res.status(404).json({ error: "Пользователь или курс не найден" });
    }

    const isAlreadyEnrolled = await user.hasCourse(course);
    if (isAlreadyEnrolled) {
      return res
        .status(409)
        .json({ error: "Студент уже зачислен на этот курс" });
    }

    await user.addCourse(course);
    res.status(201).json({ message: "Студент успешно зачислен на курс" });
  } catch (err) {
    console.error("Ошибка при зачислении:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};
