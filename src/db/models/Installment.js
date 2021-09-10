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
      Installment.belongsTo(models["Grade"], {
        foreignKey: "GradeId"
      });
      Installment.hasMany(models["Payment"], {
        foreignKey: "InstallmentId"
      });
    }
  }
  Installment.init({
    InstallmentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    InstallmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    InstallmentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    InstallmentStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    InstallmentEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    GradeId: {
      type: DataTypes.INTEGER,
      allowNull: false
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