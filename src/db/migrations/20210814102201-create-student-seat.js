module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StudentSeat", {
      StudentNationalId: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: "Student",
          key: "StudentNationalId"
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
