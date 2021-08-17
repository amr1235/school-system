const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      District.hasMany(models["Student"], {
        foreignKey: "StudentBirthDistrictId"
      });
    }
  }
  District.init({
    DistrictId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DistrictName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlpha: true
      }
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "District",
    freezeTableName: true,
  });
  return District;
};