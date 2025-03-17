const sequelize = require("../config/database");
const User = require("./User");
const Course = require("./Course");
const Material = require("./material");
const TeacherRequest = require("./teacherRequest");

User.belongsToMany(Course, {
  through: "UserCourses", 
  foreignKey: "UserId",   
  otherKey: "CourseId",    
  as: "courses",
});

Course.belongsToMany(User, {
  through: "UserCourses",
  foreignKey: "CourseId",  
  otherKey: "UserId",      
  as: "users" 
});

Course.hasMany(Material, { foreignKey: "courseId", onDelete: "CASCADE" });
Material.belongsTo(Course, { foreignKey: "courseId" });

module.exports = { sequelize, User, Course, TeacherRequest, Material};
