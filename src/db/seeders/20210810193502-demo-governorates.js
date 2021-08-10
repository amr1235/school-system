module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 30; i++) {
      records.push({
        GovernorateId: i,
        GovernorateName: `Governorate ${i}`,
      })
    }
    await queryInterface.bulkInsert('Governorate', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Governorate', null, {});
  }
};
