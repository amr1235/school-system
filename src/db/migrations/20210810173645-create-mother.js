module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mother', {
      MotherNationalId: {
        type: Sequelize.STRING,
        primaryKey: true,
        validate: {
          isNumeric: true,
          len: [14, 14]
        }
      },
      MotherName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      MotherAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      MotherAcademicDegreeId: {
        type: Sequelize.INTEGER,
      },
      MotherJobId: {
        type: Sequelize.INTEGER,
      },
      MotherJobAddress: {
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
    await queryInterface.dropTable('Mother');
  }
};