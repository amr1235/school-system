module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BusRoute", {
      BusRouteId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      BusRouteName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      BusRouteDriverName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      BusRouteCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("BusRoute");
  }
};
