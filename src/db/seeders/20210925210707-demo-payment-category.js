module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    let records = require("./data/payment-category.json");
    await queryInterface.bulkInsert("PaymentCategory", records, {});
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("PaymentCategory", null, {});
  }
};
