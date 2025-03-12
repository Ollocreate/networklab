'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Добавляем новые колонки (с `allowNull: true`, чтобы избежать конфликта)
    await queryInterface.addColumn("TeacherRequests", "username", {
      type: Sequelize.STRING,
      allowNull: true, 
    });

    await queryInterface.addColumn("TeacherRequests", "email", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn("TeacherRequests", "password", {
      type: Sequelize.STRING,
      allowNull: true, 
    });

    // Переносим данные из User в TeacherRequest (если связь есть)
    await queryInterface.sequelize.query(`
      UPDATE "TeacherRequests" AS t
      SET 
        "username" = u."username",
        "email" = u."email",
        "password" = u."password"
      FROM "Users" AS u
      WHERE t."userId" = u."id"
    `);

    // Делаем новые колонки обязательными
    await queryInterface.changeColumn("TeacherRequests", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("TeacherRequests", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("TeacherRequests", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Удаляем `userId`
    await queryInterface.removeColumn("TeacherRequests", "userId");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("TeacherRequests", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.sequelize.query(`
      UPDATE "TeacherRequests" AS t
      SET "userId" = u."id"
      FROM "Users" AS u
      WHERE t."email" = u."email"
    `);

    await queryInterface.removeColumn("TeacherRequests", "username");
    await queryInterface.removeColumn("TeacherRequests", "email");
    await queryInterface.removeColumn("TeacherRequests", "password");
  }
};