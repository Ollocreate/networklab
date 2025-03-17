const { Course } = require("../models");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: ["id", "title", "slug"],
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({ title, description });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoursesByUser = async (req, res) => {
  try {
    const userId = req.params.UserId;
    const userCourses = await db.UserCourses.findAll({
      where: { userId },
      include: [{ model: db.Course }],
    });

    res.json(userCourses.map(uc => uc.Course)); 
  } catch (error) {
    console.error("Ошибка загрузки курсов пользователя:", error);
    res.status(500).send("Ошибка сервера");
  }
}
