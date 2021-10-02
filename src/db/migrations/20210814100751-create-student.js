module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Student", {
        StudentId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        StudentNationalId: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
        StudentPassportId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        StudentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        StudentBirthDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        StudentBirthPlace: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        StudentAddress: {
          type: Sequelize.STRING,
          allowNull: false
        },
        StudentSex: {
          type: Sequelize.ENUM,
          values: ["MALE", "FEMALE"],
          defaultValue: "MALE",
          allowNull: false
        },
        StudentReligion: {
          type: Sequelize.ENUM,
          values: ["MUSLIM", "JEW", "CHRISTIAN"],
          defaultValue: "MUSLIM",
          allowNull: false
        },
        StudentNationalityId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        StudentRegisterDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        StudentSiblingOrder: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        StudentResponsibleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        StudentResponsibleRelation: {
          type: Sequelize.STRING,
          allowNull: false
        },
        StudentFatherId: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        StudentMotherId: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        StudentFamilyStatus: {
          type: Sequelize.STRING,
        },
        StudentHealth: {
          type: Sequelize.STRING
        },
        StudentExitDate : {
          type: Sequelize.DATEONLY
        }
      }, { transaction: t });
      await queryInterface.addIndex("Student", ["StudentName"], { transaction: t });
      await queryInterface.addIndex("Student", ["StudentNationalityId", "StudentPassportId"], {
        unique: true,
        transaction: t
      });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Student");
  }
};
