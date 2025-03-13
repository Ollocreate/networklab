const sequelize = require("../config/database");
const User = require("./User");
const Course = require("./Course");
const Material = require("./material");
const TeacherRequest = require("./teacherRequest");

// Связь "многие ко многим" (пользователь может записаться на несколько курсов)
User.belongsToMany(Course, { through: "UserCourses" });
Course.belongsToMany(User, { through: "UserCourses" });

Course.hasMany(Material, { foreignKey: "courseId", onDelete: "CASCADE" });
Material.belongsTo(Course, { foreignKey: "courseId" });

module.exports = { sequelize, User, Course, TeacherRequest, Material};
