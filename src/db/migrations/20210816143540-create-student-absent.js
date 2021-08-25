module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentAbsent", {
        StudentId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "Student",
            key: "StudentId"
          }
        },
        AbsentReasonId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "AbsentReason",
            key: "AbsentReasonId"
          }
        },
        AbsentDate: {
          type: Sequelize.DATEONLY,
          primaryKey: true,
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentAbsent", ["AbsentDate","StudentId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentAbsent");
  }
};