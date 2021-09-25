const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      Grade.belongsTo(models["Stage"], {
        foreignKey: "StageId"
      });
      Grade.hasMany(models["Class"], {
        foreignKey: "GradeId"
      });
      Grade.hasMany(models["Category"], {
        foreignKey: "GradeId"
      });
    }
  }
  Grade.init({
    GradeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    GradeName: {
      type: DataTypes.STRING,
      unique: true
    },
    StageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Grade",
    freezeTableName: true,
    indexes: [
      {
        fields: ["StageId"]
      }
    ]
  });
  return Grade;
};