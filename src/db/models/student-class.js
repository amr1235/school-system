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
        foreignKey: "StudentId"
      });
      StudentClass.belongsTo(models["Class"], {
        foreignKey: "ClassId"
      });
    }
  }
  StudentClass.init({
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    ClassId: {
      type: DataTypes.INTEGER,
      primaryKey: true
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
        fields: ["ClassId", "StudentId"]
      }
    ]
  });
  return StudentClass;
};