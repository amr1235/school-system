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
      Payment.belongsTo(models["Installment"], {
        foreignKey: "InstallmentId"
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
    InstallmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PaymentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PaymentDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    PaymentPaidDate: {
      type: DataTypes.DATEONLY,
    },
    PaidAmount: {
      type: DataTypes.FLOAT,
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Payment",
    freezeTableName: true,
  });
  return Payment;
};