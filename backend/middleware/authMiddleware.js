const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("🔴 Токен отсутствует");
    return res.status(401).json({ error: "Нет доступа" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Расшифрованный токен:", decoded);

    if (!roles.includes(decoded.role)) {
      console.log(`🔴 У пользователя роль "${decoded.role}", но нужен: ${roles}`);
      return res.status(403).json({ error: "Нет прав доступа" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("🔴 Ошибка проверки токена:", error.message);
    return res.status(401).json({ error: "Неверный токен" });
  }
};

module.exports = authMiddleware;
