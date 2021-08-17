module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Department", {
      DepartmentId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DepartmentName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      DepartmentPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Department");
  }
};
