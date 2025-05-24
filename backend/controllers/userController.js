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

