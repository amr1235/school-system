module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("District", {
      DistrictId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DistrictName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("District");
  }
};
