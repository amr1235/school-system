const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentDiscount extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      StudentDiscount.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
      StudentDiscount.belongsTo(models["Discount"], {
        foreignKey: "DiscountId"
      });
    }
  }
  StudentDiscount.init({
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    DiscountId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "StudentDiscount",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["DiscountId","StudentId"]
      }
    ]
  });
  return StudentDiscount;
};