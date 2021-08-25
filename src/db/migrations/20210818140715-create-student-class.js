module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentClass", {
        StudentId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "Student",
            key: "StudentId"
          },
        },
        ClassId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "Class",
            key: "ClassId"
          },
        },
      }, { transaction: t });
      await queryInterface.addIndex("StudentClass", ["ClassId", "StudentId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentClass");
  }
};