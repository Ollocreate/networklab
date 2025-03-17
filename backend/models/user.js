const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM("student", "teacher", "admin"), 
    allowNull: false, 
    defaultValue: "student" 
    },
  approved: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  } 
  },
);

module.exports = User;