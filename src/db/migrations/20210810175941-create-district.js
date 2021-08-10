'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('District', {
      DistrictId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DistrictName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('District');
  }
};
