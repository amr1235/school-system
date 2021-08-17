module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    let records = require("./data/students.json");
    await queryInterface.bulkInsert("Student", records, {});
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Student", null, {});
  }
};
