const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AbsentReason extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      AbsentReason.hasMany(models["StudentAbsent"], {
        foreignKey: "StudentAbsentReasonId"
      });
    }
  }
  AbsentReason.init({
    AbsentReasonId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    AbsentReasonName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "AbsentReason",
    freezeTableName: true,
  });
  return AbsentReason;
};