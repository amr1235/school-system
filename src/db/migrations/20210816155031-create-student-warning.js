module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentWarning", {
        StudentId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Student",
            key: "StudentId"
          },
          primaryKey: true
        },
        WarningDate: {
          type: Sequelize.DATEONLY,
          primaryKey: true
        },
        IsRecieved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentWarning", ["WarningDate","StudentId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentWarning");
  }
};