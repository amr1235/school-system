module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Parent", {
        ParentId: {
          type: Sequelize.INTEGER,
          autoIncrement : true,
          primaryKey: true
        },
        ParentNationalId: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: true,
        },
        ParentPassportId: {
          type: Sequelize.STRING,
          isAlphanumeric: true,
          allowNull: true
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
        },
        ParentNationalityId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Nationality",
            key: "NationalityId"
          }
        },
        ParentAcademicDegree: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["BACHELOR", "MASTERS", "PHD", "SECONDARY"]
        },
      }, { transaction: t });
      await queryInterface.addIndex("Parent", ["ParentName"], { transaction: t });
      await queryInterface.addIndex("Parent", ["ParentNationalityId", "ParentPassportId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Parent");
  }
};