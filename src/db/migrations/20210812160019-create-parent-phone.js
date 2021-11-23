module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("ParentPhone", {
        ParentId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Parent",
            key: "ParentId"
          },
          primaryKey: true,
          allowNull: false
        },
        ParentPhoneNumber: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
      }, { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("ParentPhone");
  }
};
