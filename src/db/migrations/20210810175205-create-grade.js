module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      
      await queryInterface.createTable("Grade", {
        GradeId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        GradeName: {
          type: Sequelize.STRING,
          unique: true
        },
        StageId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Stage",
            key: "StageId"
          }
        }
      }, { transaction: t });
      
      await queryInterface.addIndex("Grade", ["StageId"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Grade");
  }
};
