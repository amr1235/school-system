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
        PaymentType: {
          type: Sequelize.ENUM,
          values: ["Category","Bus"],
          allowNull: false
        },
        PaymentAmount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        PaymentDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Payment");
  }
};