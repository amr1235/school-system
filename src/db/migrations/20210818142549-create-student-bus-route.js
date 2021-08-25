module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentBusRoute", {
        StudentId: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        BusRouteId: {
          type: Sequelize.INTEGER,
          references: {
            model: "BusRoute",
            key: "BusRouteId"
          },
          primaryKey: true
        },
        IsFullRoute: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentBusRoute", ["BusRouteId", "StudentId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentBusRoute");
  }
};