const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Statistic = sequelize.define(
  "Statistic",
  {
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports = Statistic;
