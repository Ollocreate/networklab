const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const materialRoutes = require("./routes/materialRoutes");
const labRoutes = require("./routes/labRoutes");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:8080", // Разрешить запросы с фронтенда
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
    credentials: true, // Разрешить передачу кук и заголовков авторизации
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Все маршруты материалов теперь доступны по /api/materials
app.use("/api/materials", materialRoutes);
app.use("/api/labs", labRoutes);

sequelize.sync().then(() => console.log("Database synced"));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
