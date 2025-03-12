const { User, TeacherRequest } = require("../models");
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

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      approved: role === "admin" ? true : false,
    });

    const token = generateToken(newUser);
    res.json({ token, user: { id: newUser.id, username, email, role } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
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
