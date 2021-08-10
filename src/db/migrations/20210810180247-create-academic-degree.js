'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AcademicDegree', {
      AcademicDegreeId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AcademicDegreeName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AcademicDegree');
  }
};
