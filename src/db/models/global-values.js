const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GlobalValues extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
  }
  GlobalValues.init({
    GlobalValuesId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    GlobalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    GlobalValue: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "GlobalValues",
    freezeTableName: true,
  });
  return GlobalValues;
};