module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Installment", {
        InstallmentId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        StudentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Student",
            key: "StudentId"
          }
        },
        InstallmentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        InstallmentAmount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        InstallmentPaidAmount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        InstallmentDueDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        InstallmentFullyPaidDate: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        InstallmentType: {
          type: Sequelize.ENUM,
          values: ["Category", "Bus"],
          allowNull: false
        },
        Status: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["PAID", "DUE", "LATE", "FROMLASTYEAR"],
          defaultValue: "DUE"
        }
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Installment");
  }
};