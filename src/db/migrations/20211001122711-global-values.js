module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("GlobalValues", {
        GlobalValuesId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        GlobalName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        GlobalValue: {
          type: Sequelize.STRING,
          allowNull: false,
        }
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("GlobalValues");
  }
};