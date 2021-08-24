const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      Job.hasMany(models["ParentJob"],{
        foreignKey: "ParentJobId"
      });
    }
  }
  Job.init({
    JobId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    JobName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Job",
    freezeTableName: true,
  });
  return Job;
};