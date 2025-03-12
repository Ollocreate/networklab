'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "role" = CASE 
        WHEN "role" = 'студент' THEN 'student'
        WHEN "role" = 'преподаватель' THEN 'teacher'
        ELSE 'student' 
      END;
    `);

    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_role";`);

    await queryInterface.sequelize.query(`CREATE TYPE "enum_Users_role" AS ENUM ('student', 'teacher', 'admin');`);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "role" TYPE "enum_Users_role" 
      USING "role"::"enum_Users_role";
    `);

    const table = await queryInterface.describeTable("Users");
    if (!table.approved) {
      await queryInterface.addColumn("Users", "approved", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "role");
    await queryInterface.removeColumn("Users", "approved");
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_role";`);
  },
};


