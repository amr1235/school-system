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
      Parent.belongsTo(models["Nationality"], {
        foreignKey: "ParentNationalityId"
      });
      Parent.hasMany(models["Student"], {
        as: "Mother",
        foreignKey: "StudentMotherId"
      });
      Parent.hasMany(models["Student"], {
        as: "Father",
        foreignKey: "StudentFatherId"
      });
      Parent.hasMany(models["Student"], {
        as: "Responsible",
        foreignKey: "StudentResponsibleId"
      });
      Parent.hasMany(models["ParentJob"], {
        foreignKey: "ParentId"
      });
      Parent.hasMany(models["ParentPhone"], {
        foreignKey: "ParentId"
      });
    }
  }
  Parent.init({
    ParentId: {
      type: DataTypes.INTEGER,
      autoIncrement : true,
      primaryKey: true
    },
    ParentNationalId: {
      type: DataTypes.STRING,
      unique: true,
    },
    ParentPassportId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ParentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ParentAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ParentNationalityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ParentAcademicDegree: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["بدون مؤهل","دبلوم","اعدادية","تعليم متوسط","تعليم عالي"]
    },
    IsDead : {
      type : DataTypes.BOOLEAN,
      defaultValue : false,
      allowNull : false
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Parent",
    freezeTableName: true,
    indexes: [
      {
        fields: ["ParentName"]
      },
      {
        unique: true,
        fields: ["ParentNationalityId", "ParentPassportId"]
      }
    ]
  });
  return Parent;
};