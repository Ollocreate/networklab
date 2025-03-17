const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = (roles = []) => async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("🔴 Токен отсутствует");
    return res.status(401).json({ error: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Расшифрованный токен:", decoded);

    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      console.log(`🔴 У пользователя роль "${req.user.role}", но нужен: ${roles}`);
      return res.status(403).json({ error: "Нет прав доступа" });
    }

    console.log("🔵 Middleware прошел, продолжаем...");
    next();
  } catch (error) {
    console.log("🔴 Ошибка проверки токена:", error.message);
    return res.status(401).json({ error: "Неверный токен" });
  }
};

module.exports = authMiddleware;
