module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 30; i++) {
      records.push({
        BusRouteId: i,
        BusRouteName: `BusRoute ${i}`,
        BusRouteCost: i * 100
      });
    }
    await queryInterface.bulkInsert('BusRoute', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('BusRoute', null, {});
  }
};
