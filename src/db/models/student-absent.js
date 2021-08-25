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
        foreignKey: "StudentId"
      });
      StudentAbsent.belongsTo(models["AbsentReason"], {
        foreignKey: "AbsentReasonId"
      });
    }
  }
  StudentAbsent.init({
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    AbsentReasonId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AbsentDate: {
      type: DataTypes.DATEONLY,
      primaryKey: true
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "StudentAbsent",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["AbsentDate","StudentId"]
      }
    ]
  });
  return StudentAbsent;
};