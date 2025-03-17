const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define("Course", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Course;
