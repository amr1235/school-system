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
        as: "Responsible",
        foreignKey: "StudentResponsibleId"
      });
      Student.belongsTo(models["Parent"], {
        as: "Mother",
        foreignKey: "StudentMotherId"
      });
      Student.belongsTo(models["Parent"], {
        as: "Father",
        foreignKey: "StudentFatherId"
      });
      Student.belongsTo(models["Nationality"], {
        foreignKey: "StudentNationalityId"
      });
      Student.hasOne(models["TransferredStudent"], {
        foreignKey: "StudentId"
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
      Student.hasMany(models["Payment"], {
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
    },
    StudentPassportId: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
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
      type: DataTypes.STRING,
    },
    StudentHealth: {
      type: DataTypes.STRING
    },
    StudentExitDate : {
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Student",
    freezeTableName: true,
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