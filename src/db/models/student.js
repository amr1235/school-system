const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      Student.belongsTo(models["Parent"], {
        foreignKey: "StudentMotherNationalId"
      });
      Student.belongsTo(models["Parent"], {
        foreignKey: "StudentFatherNationalId"
      });
      Student.belongsTo(models["Governorate"], {
        foreignKey: "StudentBirthGovernorateId"
      });
      Student.belongsTo(models["District"], {
        foreignKey: "StudentBirthDistrictId"
      });
      Student.hasOne(models["StudentBusRoute"], {
        foreignKey: "StudentNationalId"
      });
      Student.hasOne(models["StudentClass"], {
        foreignKey: "StudentNationalId"
      });
      Student.hasMany(models["StudentAbsent"], {
        foreignKey: "StudentNationalId"
      });
      Student.hasMany(models["StudentWarning"], {
        foreignKey: "StudentNationalId"
      });
      Student.hasMany(models["StudentDiscount"], {
        foreignKey: "StudentNationalId"
      });
    }
  }
  Student.init({
    StudentNationalId: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    StudentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StudentBirthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StudentBirthGovernorateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StudentBirthDistrictId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StudentAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    StudentSex: {
      type: DataTypes.ENUM,
      values: ["MALE", "FEMALE"],
      defaultValue: "MALE",
      allowNull: false
    },
    StudentReligion: {
      type: DataTypes.ENUM,
      values: ["MUSLIM", "JEW", "CHRISTIAN"],
      defaultValue: "MUSLIM",
      allowNull: false
    },
    // NOT IMPLEMENTED!!!
    // StudentNationalityId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: "Nationality"
    //     },
    // },
    StudentRegisterDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StudentSiblingOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    StudentResponsibleNationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    StudentResponsibleRelation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    StudentFatherNationalId: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    StudentMotherNationalId: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    StudentFamilyStatus: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["ORPHAN", "MARRIED", "DIVORCED", "DEAD MOTHER", "DEAD FATHER"]
    },
    StudentBusRouteId: DataTypes.INTEGER,
    IsFullBusRoute: DataTypes.BOOLEAN,
    IsRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Student",
    freezeTableName: true,
    validate: {
      checkFamilyStatus() {
        if (this.StudentFamilyStatus == "ORPHAN" && this.StudentMotherNationalId) {
          throw new Error("Can't set a Mother National Id to a Student with a Dead Mother");
        }
        else if (this.StudentFamilyStatus == "ORPHAN" && this.StudentFatherNationalId) {
          throw new Error("Can't set a Father National Id to a Student with a Dead Father");
        }
        else if (this.StudentFamilyStatus == "DEAD MOTHER" && this.StudentMotherNationalId) {
          throw new Error("Can't set a Mother National Id to a Student with a Dead Mother");
        }
        else if (this.StudentFamilyStatus == "DEAD FATHER" && this.StudentFatherNationalId) {
          throw new Error("Can't set a Father National Id to a Student with a Dead Father");
        }
      }
    },
    indexes: [
      {
        fields: ["StudentNationalId", "IsRegistered"]
      },
      {
        fields: ["StudentName", "IsRegistered"]
      },
      {
        fields: ["StudentBusRouteId", "StudentNationalId"]
      }
    ]
  });
  return Student;
};