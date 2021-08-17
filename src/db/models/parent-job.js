const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParentJob extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      ParentJob.belongsTo(models["Parent"], {
        foreignKey: "ParentNationalId"
      });
      ParentJob.belongsTo(models["Job"], {
        foreignKey: "ParentJobId",
      });
    }
  }
  ParentJob.init({
    ParentNationalId: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len:[14,14]
      }
    },
    ParentJobId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ParentJobAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "ParentJob",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["ParentNationalId","ParentJobId"]
      },
      {
        fields: ["ParentJobId"]
      }
    ]
  });
  return ParentJob;
};