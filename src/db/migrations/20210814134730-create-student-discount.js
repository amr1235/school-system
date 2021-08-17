module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentDiscount", {
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
        DiscountId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Discount",
            key: "DiscountId"
          }
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentDiscount", ["StudentNationalId", "DiscountId"], {
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