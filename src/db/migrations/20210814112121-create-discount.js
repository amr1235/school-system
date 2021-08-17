module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Discount", {
      DiscountId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DiscountName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      DiscountCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Discount");
  }
};
