const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {  }
  Department.init({
    DepartmentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    DepartmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlpha: true
      }
    },
    DepartmentPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "Department",
    freezeTableName: true,
  });
  return Department;
};