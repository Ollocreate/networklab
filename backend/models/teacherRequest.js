const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs"); // Импортируем bcrypt

const TeacherRequest = sequelize.define("TeacherRequest", {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM("pending", "approved", "rejected"), 
    defaultValue: "pending" 
  }
}, {
  hooks: {
    beforeCreate: async (teacherRequest) => {
      teacherRequest.password = await bcrypt.hash(teacherRequest.password, 10);
    }
  }
});

module.exports = TeacherRequest;
