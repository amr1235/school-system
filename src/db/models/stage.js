const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
    static associate(models) {
      // define association here
      Stage.hasMany(models["Grade"], {
        foreignKey: "GradeId"
      });
    }
  }
  Stage.init({
    StageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    StageName: {
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Stage",
    freezeTableName: true,
  });
  return Stage;
};