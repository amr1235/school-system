module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("ParentJob", {
        ParentNationalId: {
          type: Sequelize.STRING,
          references: {
            model: "Parent",
            key: "ParentNationalId"
          },
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        ParentJobId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Job",
            key: "JobId"
          },
          allowNull: false
        },
        ParentJobAddress: {
          type: Sequelize.STRING,
          allowNull: false
        },
      }, { transaction: t });
      await queryInterface.addIndex("ParentJob", ["ParentJobId"], { transaction: t });
      await queryInterface.addIndex("ParentJob", ["ParentNationalId", "ParentJobId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("ParentJob");
  }
};