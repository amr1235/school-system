module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Father', {
      FatherNationalId: {
        type: Sequelize.STRING,
        primaryKey: true,
        validate: {
          isNumeric: true,
          len: [14, 14]
        }
      },
      FatherName: {
        type: Sequelize.STRING,
        allowNull: false,
        },
      FatherAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      FatherAcademicDegreeId: {
        type: Sequelize.INTEGER,
      },
      FatherJobId: {
        type: Sequelize.INTEGER,
      },
      FatherJobAddress: {
        type: Sequelize.STRING,
      },
      IsEmployee: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Father');
  }
};