module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 30; i++) {
      records.push({
        DistrictId: i,
        DistrictName: `District ${i}`,
      })
    }
    await queryInterface.bulkInsert('District', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('District', null, {});
  }
};
