module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("StudentBusRoute", {
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
        BusRouteId: {
          type: Sequelize.INTEGER,
          references: {
            model: "BusRoute",
            key: "BusRouteId"
          },
          allowNull: false
        },
        IsFullRoute: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      }, { transaction: t });
      await queryInterface.addIndex("StudentBusRoute", ["BusRouteId", "StudentNationalId"], { transaction: t });
      await queryInterface.addIndex("StudentBusRoute", ["StudentNationalId", "BusRouteId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentBusRoute");
  }
};