module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable("Student", {
        StudentNationalId: {
          type: Sequelize.STRING,
          primaryKey: true,
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        StudentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        StudentBirthDate: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        StudentBirthGovernorateId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Governorate",
            key: "GovernorateId"
          }
        },
        StudentBirthDistrictId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "District",
            key: "DistrictId"
          }
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
        // NOT IMPLEMENTED!!!
        // StudentNationalityId: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "Nationality"
        //     },
        // },
        StudentRegisterDate: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        StudentSiblingOrder: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        StudentResponsibleNationalId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "Parent",
            key: "ParentNationalId"
          },
          validate: {
            isNumeric: true,
            len: [14, 14]
          }
        },
        StudentResponsibleRelation: {
          type: Sequelize.STRING,
          allowNull: false
        },
        StudentFatherNationalId: {
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
        StudentMotherNationalId: {
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
        StudentFamilyStatus: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["ORPHAN", "MARRIED", "DIVORCED", "DEAD MOTHER", "DEAD FATHER"]
        },
        StudentBusRouteId: Sequelize.INTEGER,
        IsFullBusRoute: Sequelize.BOOLEAN,
        IsRegistered: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
      }, { transaction: t });
      await queryInterface.addIndex("Student", ["IsRegistered","StudentNationalId"], { transaction: t });
      await queryInterface.addIndex("Student", ["IsRegistered","StudentName"], { transaction: t });
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Student");
  }
};
