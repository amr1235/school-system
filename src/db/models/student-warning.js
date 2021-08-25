const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentWarning extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      StudentWarning.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
    }
  }
  StudentWarning.init({
    StudentId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    WarningDate: {
      type: DataTypes.DATEONLY,
      primaryKey: true
    },
    IsRecieved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "StudentWarning",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["WarningDate","StudentId"]
      }
    ]
  });
  return StudentWarning;
};