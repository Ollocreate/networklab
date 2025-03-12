'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: true
    });

    const defaultPassword = await require("bcryptjs").hash("default_password", 10);
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "password" = '${defaultPassword}'
      WHERE "password" IS NULL
    `);

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("студент", "преподаватель"),
      allowNull: false,
      defaultValue: "студент"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "password");
    await queryInterface.removeColumn("Users", "role");
  }
};
