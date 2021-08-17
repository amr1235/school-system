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
        foreignKey: "StudentNationalId"
      });
      StudentDiscount.belongsTo(models["Discount"], {
        foreignKey: "DiscountId"
      });
    }
  }
  StudentDiscount.init({
    StudentNationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    DiscountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
        fields: ["StudentNationalId","DiscountId"]
      }
    ]
  });
  return StudentDiscount;
};