'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('Class', {
      ClassId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ClassCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      GradeNumber: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 6
        },
        allowNull: false
      },
      StageName: {
        type: Sequelize.ENUM,
        values: ["NURSERY", "KG", "PRIMARY", "PREP", "SECONDARY"],
        allowNull: false
      }
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Class');
  }
};
