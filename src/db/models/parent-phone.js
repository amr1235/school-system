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
        foreignKey: "ParentId"
      });
    }
  }
  ParentPhone.init({
    ParentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    ParentPhoneNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
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
        fields: ["ParentId"]
      }
    ]
  });
  return ParentPhone;
};