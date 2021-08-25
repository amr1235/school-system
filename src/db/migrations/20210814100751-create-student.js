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
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        StudentPassportId: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            isAlphanumeric: true
          }
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
          allowNull: false,
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
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["ORPHAN", "MARRIED", "DIVORCED", "DEAD MOTHER", "DEAD FATHER"]
        },
        StudentHealth: {
          type: Sequelize.STRING
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
