module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Job", {
      JobId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      JobName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Job");
  }
};
