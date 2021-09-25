module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Category", {
      CategoryId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      GradeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CategoryName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CategoryCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      AcademicYear: {
      type: Sequelize.STRING,
      allowNull: false
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Category");
  }
};
