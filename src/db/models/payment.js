const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      Payment.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
      Payment.hasMany(models["PaymentCategory"], {
        foreignKey: "PaymentId"
      });
    }
  }
  Payment.init({
    PaymentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PaymentType: {
      type: DataTypes.ENUM,
      values: ["Category","Bus"],
      allowNull: false
    },
    PaymentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PaymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Payment",
    freezeTableName: true,
  });
  return Payment;
};