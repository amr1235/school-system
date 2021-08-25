module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Nationality", {
      NationalityId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      NationalityName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isAlpha: true
        }
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Nationality");
  }
};
