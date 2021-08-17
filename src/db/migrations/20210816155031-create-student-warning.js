module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentWarning", {
        StudentNationalId: {
          type: Sequelize.STRING,
          references: {
            model: "Student",
            key: "StudentNationalId"
          },
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        StudentWarningId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        WarningDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        IsRecieved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentWarning", ["StudentNationalId", "WarningDate"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentWarning");
  }
};