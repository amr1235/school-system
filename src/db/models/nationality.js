const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Nationality extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      Nationality.hasMany(models["Student"], {
        foreignKey: "StudentNationalityId"
      });
    }
  }
  Nationality.init({
    NationalityId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    NationalityName: {
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
    modelName: "Nationality",
    freezeTableName: true,
  });
  return Nationality;
};