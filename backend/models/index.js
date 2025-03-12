const sequelize = require("../config/database");
const User = require("./User");
const Course = require("./Course");
const TeacherRequest = require("./teacherRequest");

// Связь "многие ко многим" (пользователь может записаться на несколько курсов)
User.belongsToMany(Course, { through: "UserCourses" });
Course.belongsToMany(User, { through: "UserCourses" });

module.exports = { sequelize, User, Course, TeacherRequest};
