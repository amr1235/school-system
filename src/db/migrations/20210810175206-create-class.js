module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {

      await queryInterface.createTable("Class", {
        ClassId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        GradeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Grade",
            key: "GradeId"
          }
        },
        ClassName: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }, { transaction: t });

      await queryInterface.addIndex("Class", ["GradeId"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Class");
  }
};
