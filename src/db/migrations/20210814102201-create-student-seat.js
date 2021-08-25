module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StudentSeat", {
      StudentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Student",
          key: "StudentId"
        }
      },
      SeatNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentSeat");
  }
};
