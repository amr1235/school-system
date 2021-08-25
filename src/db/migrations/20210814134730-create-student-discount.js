module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentDiscount", {
        StudentId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Student",
            key: "StudentId"
          },
          primaryKey: true,
        },
        DiscountId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "Discount",
            key: "DiscountId"
          }
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentDiscount", ["DiscountId", "StudentId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentDiscount");
  }
};