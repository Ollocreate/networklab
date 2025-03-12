const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./models");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:8080", // Разрешить запросы с фронтенда
  methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
  credentials: true, // Разрешить передачу кук и заголовков авторизации));
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Синхронизация с базой
sequelize.sync().then(() => console.log("Database synced"));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



