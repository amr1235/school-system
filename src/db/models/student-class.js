const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      StudentClass.belongsTo(models["Student"], {
        foreignKey: "StudentNationalId"
      });
      StudentClass.belongsTo(models["Class"], {
        foreignKey: "ClassId"
      });
    }
  }
  StudentClass.init({
    StudentNationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    ClassId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "StudentClass",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["StudentNationalId", "ClassId"]
      },
      {
        fields: ["ClassId", "StudentNationalId"]
      }
    ]
  });
  return StudentClass;
};