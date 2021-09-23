module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TransferredStudent", {
      StudentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Student",
          key: "StudentId"
        }
      },
      TransferDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      SchoolName: {
        type: Sequelize.STRING,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TransferredStudent");
  }
};
