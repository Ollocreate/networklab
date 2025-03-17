'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Courses', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: '',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courses', 'slug');
  }
};
