module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Installment", {
        InstallmentId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        InstallmentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        InstallmentAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        InstallmentStartDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        InstallmentEndDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        GradeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Grade",
            key: "GradeId"
          }
        }
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Installment");
  }
};