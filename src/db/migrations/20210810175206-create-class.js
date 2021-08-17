module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      
      await queryInterface.createTable("Class", {
        ClassId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        GradeNumber: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1,
            max: 6
          },
          allowNull: false
        },
        StageName: {
          type: Sequelize.ENUM,
          values: ["NURSERY", "KG", "PRIMARY", "PREP", "SECONDARY"],
          allowNull: false
        }
      }, { transaction: t });
      
      await queryInterface.addIndex("Class", ["StageName", "GradeNumber"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Class");
  }
};
