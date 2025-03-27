const { User, TeacherRequest, Course } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const { eveNgClient } = require("../config/eveNgClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Этот email уже зарегистрирован" });
    }

    if (role === "teacher") {
      await TeacherRequest.create({
        username,
        email,
        password, 
        status: "pending",
      });

      return res.json({ message: "Заявка на преподавателя отправлена на рассмотрение" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      approved: role === "admin" ? true : false,
    });

    try {
      const response = await eveNgClient.post("/api/folders", {
        path: "/",
        name: `${newUser.id}_` + username,
      });

      if (response.data.status !== "success") {
        throw new Error("Ошибка при создании папки");
      }

      console.log(`📂 Папка '${username}' успешно создана в EVE-NG`);
    } catch (error) {
      console.error("❌ Ошибка при создании папки в EVE-NG:", error.response?.data || error.message);
      return res.status(500).json({ error: "Ошибка при создании папки в EVE-NG" });
    }

    const token = generateToken(newUser);
    res.json({ token, user: { id: newUser.id, username, email, role } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  console.log("Запрос на вход:", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("Пользователь не найден!");
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Неверный пароль!");
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    if (user.role === "teacher" && !user.approved) {
      return res.status(403).json({ error: "Ваш аккаунт ещё не подтверждён администратором" });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, email, role: user.role } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role"],
      include: {
        model: Course,
        as: "courses",
        through: { attributes: [] },
      },
    });

    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    if (user.role === "teacher") {
      res.json({
        user,
        courses: user.courses || [],
        message: "Профиль преподавателя",
      });
    } else if (user.role === "student") {
      res.json({
        user,
        courses: user.courses || [],
        message: "Профиль студента",
      });
    } else {
      res.status(400).json({ error: "Неизвестная роль" });
    }
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};