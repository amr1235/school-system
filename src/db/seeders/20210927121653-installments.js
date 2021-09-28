module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    let records = require("./data/Installment.json");
    await queryInterface.bulkInsert("Installment", records, {});
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Installment", null, {});
  }
};
