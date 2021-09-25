module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("PaymentCategory", {
        PaymentCategoryid: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CategoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Category",
            key: "CategoryId"
          }
        },
        PaymentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Payment",
            key: "PaymentId"
          }
        },
        Amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PaymentCategory");
  }
};