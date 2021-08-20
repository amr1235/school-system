module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentClass", {
        StudentNationalId: {
          type: Sequelize.STRING,
          references: {
            model: "Student",
            key: "StudentNationalId"
          },
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        ClassId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Class",
            key: "ClassId"
          },
          allowNull: false
        },
      }, { transaction: t });
      await queryInterface.addIndex("StudentClass", ["ClassId", "StudentNationalId"], { transaction: t });
      await queryInterface.addIndex("StudentClass", ["StudentNationalId", "ClassId"], {
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