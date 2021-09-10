module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Payment", {
        PaymentId: {
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
        InstallmentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Installment",
            key: "InstallmentId"
          }
        },
        PaymentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        PaymentAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        PaymentDueDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        PaymentPaidDate: {
          type: Sequelize.DATEONLY,
        },
        PaidAmount: {
          type: Sequelize.FLOAT,
        }
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Payment");
  }
};