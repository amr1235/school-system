module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Category", {
      CategoryId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CategoryName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      CategoryCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Category");
  }
};
