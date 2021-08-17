const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParentPhone extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      ParentPhone.belongsTo(models["Parent"], {
        foreignKey: "ParentNationalId"
      });
    }
  }
  ParentPhone.init({
    ParentNationalId: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    ParentPhoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "ParentPhone",
    freezeTableName: true,
    indexes: [
      {
        fields: ["ParentNationalId"]
      }
    ]
  });
  return ParentPhone;
};