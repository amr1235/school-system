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
        foreignKey: "StudentResponsibleId"
      });
      Student.belongsTo(models["Parent"], {
        foreignKey: "StudentMotherId"
      });
      Student.belongsTo(models["Parent"], {
        foreignKey: "StudentFatherId"
      });
      Student.belongsTo(models["Nationality"], {
        foreignKey: "StudentNationalityId"
      });
      Student.hasOne(models["StudentBusRoute"], {
        foreignKey: "StudentId"
      });
      Student.hasOne(models["StudentClass"], {
        foreignKey: "StudentId"
      });
      Student.hasMany(models["StudentAbsent"], {
        foreignKey: "StudentId"
      });
      Student.hasMany(models["StudentWarning"], {
        foreignKey: "StudentId"
      });
      Student.hasMany(models["StudentDiscount"], {
        foreignKey: "StudentId"
      });
    }
  }
  Student.init({
    StudentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    StudentNationalId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    StudentPassportId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isAlphanumeric: true
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
    StudentBirthPlace: {
      type: DataTypes.STRING,
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
    StudentNationalityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StudentRegisterDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    StudentExitDate: {
      type: DataTypes.DATEONLY,
    },
    StudentSiblingOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    StudentResponsibleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    StudentResponsibleRelation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    StudentFatherId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    StudentMotherId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    StudentFamilyStatus: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["ORPHAN", "MARRIED", "DIVORCED", "DEAD MOTHER", "DEAD FATHER"]
    },
    StudentHealth: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Student",
    freezeTableName: true,
    validate: {
      checkFamilyStatus() {
        if (this.StudentFamilyStatus == "ORPHAN" && this.StudentMotherId) {
          throw new Error("Can't set a Mother Id to a Student with a Dead Mother");
        }
        else if (this.StudentFamilyStatus == "ORPHAN" && this.StudentFatherId) {
          throw new Error("Can't set a Father Id to a Student with a Dead Father");
        }
        else if (this.StudentFamilyStatus == "DEAD MOTHER" && this.StudentMotherId) {
          throw new Error("Can't set a Mother Id to a Student with a Dead Mother");
        }
        else if (this.StudentFamilyStatus == "DEAD FATHER" && this.StudentFatherId) {
          throw new Error("Can't set a Father Id to a Student with a Dead Father");
        }
      },
      checkIds() {
        if (!this.StudentNationalId && !this.StudentPassportId) {
          throw new Error("Must specify a National Id or a Passport Id");
        }
      }
    },
    indexes: [
      {
        fields: ["StudentName"]
      },
      {
        unique: true,
        fields: ["StudentNationalityId", "StudentPassportId"]
      }
    ]
  });
  return Student;
};