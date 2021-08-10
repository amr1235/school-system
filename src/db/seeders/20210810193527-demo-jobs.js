module.exports = {
  up: async (queryInterface, Sequelize) => {
    let records = [];
    for (let i = 1; i < 30; i++) {
      records.push({
        JobId: i,
        JobName: `Job ${i}`,
      })
    }
    await queryInterface.bulkInsert('Job', records, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Job', null, {});
  }
};
