const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Installment extends Model {
    /**
             * Helper method for defining associations.
             * Thi s method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      Installment.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
    }
  }
  Installment.init({
    InstallmentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    InstallmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    InstallmentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    InstallmentPaidAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    InstallmentDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    InstallmentFullyPaidDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    InstallmentType: {
      type: DataTypes.ENUM,
      values: ["Category","Bus"],
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["PAID", "DUE", "LATE","FROMLASTYEAR"],
      defaultValue: "DUE"
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Installment",
    freezeTableName: true,
  });
  return Installment;
};