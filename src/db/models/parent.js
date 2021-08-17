const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Parent extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      Parent.hasMany(models["Student"], {
        foreignKey: "StudentMotherNationalId"
      });
      Parent.hasMany(models["Student"], {
        foreignKey: "StudentFatherNationalId"
      });
      Parent.hasMany(models["Student"], {
        foreignKey: "StudentResponsibleNationalId"
      });
      Parent.hasMany(models["ParentJob"], {
        foreignKey: "ParentNationalId"
      });
      Parent.hasMany(models["ParentPhone"], {
        foreignKey: "ParentNationalId"
      });
    }
  }
  Parent.init({
    ParentNationalId: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    ParentName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    ParentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true
      }
    },
    ParentAcademicDegree: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["BACHELOR", "MASTERS", "PHD", "SECONDARY"]
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Parent",
    freezeTableName: true,
    indexes: [
      {
        fields: ["ParentName"]
      }
    ]
  });
  return Parent;
};