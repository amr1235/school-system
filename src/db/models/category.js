const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      Category.hasMany(models["Student"], {
        foreignKey: "CategoryId"
      });
    }
  }
  Category.init({
    CategoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true
      }
    },
    CategoryCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Category",
    freezeTableName: true,
  });
  return Category;
};