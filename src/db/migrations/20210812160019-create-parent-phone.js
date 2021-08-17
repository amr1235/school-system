module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("ParentPhone", {
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
        ParentPhoneNumber: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
      }, { transaction: t });
      await queryInterface.addIndex("ParentPhone", ["ParentNationalId"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable("ParentPhone");
  }
};
