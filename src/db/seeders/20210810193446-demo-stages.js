module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    let records = require("./data/stages.json");
    await queryInterface.bulkInsert("Stage", records, {});
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Stage", null, {});
  }
};
