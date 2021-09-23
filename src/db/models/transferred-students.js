const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransferredStudent extends Model {
    /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      TransferredStudent.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
    }
  }
  TransferredStudent.init({
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    TransferDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    SchoolName: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "TransferredStudent",
    freezeTableName: true,
  });
  return TransferredStudent;
};