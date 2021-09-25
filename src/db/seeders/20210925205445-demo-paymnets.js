module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    let records = require("./data/payments.json");
    await queryInterface.bulkInsert("Payment", records, {});
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Payment", null, {});
  }
};
