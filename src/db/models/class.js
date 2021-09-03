const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      Class.belongsTo(models["Grade"], {
        foreignKey: "GradeId"
      });
      Class.hasMany(models["StudentClass"], {
        foreignKey: "ClassId"
      });
    }
  }
  Class.init({
    ClassId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    GradeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "Class",
    freezeTableName: true,
    indexes: [
      {
        fields: ["GradeId"]
      }
    ]
  });
  return Class;
};