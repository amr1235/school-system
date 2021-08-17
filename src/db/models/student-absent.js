const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentAbsent extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      StudentAbsent.belongsTo(models["Student"], {
        foreignKey: "StudentNationalId"
      });
      StudentAbsent.belongsTo(models["AbsentReason"], {
        foreignKey: "AbsentReasonId"
      });
    }
  }
  StudentAbsent.init({
    StudentAbsentId: {
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
    AbsentReasonId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AbsentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Absent",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["StudentNationalId","Date"]
      }
    ]
  });
  return StudentAbsent;
};