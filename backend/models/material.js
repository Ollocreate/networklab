const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
  courseId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: true },
  mediaUrls: { 
    type: DataTypes.JSON, 
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("mediaUrls");
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue("mediaUrls", JSON.stringify(value));
    }},
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  order: { type: DataTypes.INTEGER, allowNull: true }
});

module.exports = Material;
