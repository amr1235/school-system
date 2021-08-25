module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("ParentJob", {
        ParentId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Parent",
            key: "ParentId"
          },
          primaryKey: true
        },
        ParentJobId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Job",
            key: "JobId"
          },
          primaryKey: true
        },
        ParentJobAddress: {
          type: Sequelize.STRING,
          allowNull: false
        },
      }, { transaction: t });
      await queryInterface.addIndex("ParentJob", ["ParentJobId","ParentId"], {
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