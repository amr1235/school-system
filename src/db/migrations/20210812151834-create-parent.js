module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Parent", {
        ParentNationalId: {
          type: Sequelize.STRING,
          primaryKey: true,
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        ParentName: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isAlpha: true
          }
        },
        ParentAddress: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isAlphanumeric: true
          }
        },
        ParentAcademicDegree: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["BACHELOR","MASTERS","PHD","SECONDARY"]
        },
      },{ transaction: t });
      await queryInterface.addIndex("Parent", ["ParentName"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Parent");
  }
};