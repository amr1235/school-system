module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentAbsent", {
        StudentAbsentId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        StudentNationalId: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        AbsentReasonId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "AbsentReason",
            key: "AbsentReasonId"
          }
        },
        AbsentDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentAbsent", ["StudentNationalId","AbsentDate"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentAbsent");
  }
};