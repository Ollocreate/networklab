'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Materials', {
      id: { 
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      courseId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: 'Courses', key: 'id' }, 
        onDelete: 'CASCADE' 
      },
      title: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      content: { 
        type: Sequelize.TEXT, 
        allowNull: false 
      },
      mediaUrls: { 
        type: Sequelize.JSON, 
        allowNull: true 
      },
      parentId: { 
        type: Sequelize.INTEGER, 
        allowNull: true, 
        references: { model: 'Materials', key: 'id' } 
      },
      order: { 
        type: Sequelize.INTEGER, 
        allowNull: false 
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Materials');
  }
};
