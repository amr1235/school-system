const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentCategory extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      PaymentCategory.belongsTo(models["Category"], {
        foreignKey: "CategoryId"
      });
      PaymentCategory.belongsTo(models["Payment"], {
        foreignKey: "PaymentId"
      });
    }
  }
  PaymentCategory.init({
    PaymentCategoryid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull : false
    },
    PaymentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "PaymentCategory",
    freezeTableName: true,
  });
  return PaymentCategory;
};