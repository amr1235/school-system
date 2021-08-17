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
        foreignKey: "StudentNationalId"
      });
    }
  }
  StudentWarning.init({
    StudentWarningId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentNationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    WarningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
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
        fields: ["StudentNationalId", "WarningDate"]
      }
    ]
  });
  return StudentWarning;
};