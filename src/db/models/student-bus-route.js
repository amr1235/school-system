const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentBusRoute extends Model {
    /**
                 * Helper method for defining associations.
                 * This method is not a part of Sequelize lifecycle.
                 * The `models/index` file will call this method automatically.
                 */
    static associate(models) {
      // define association here
      StudentBusRoute.belongsTo(models["Student"], {
        foreignKey: "StudentNationalId"
      });
      StudentBusRoute.belongsTo(models["BusRoute"], {
        foreignKey: "BusRouteId"
      });
    }
  }
  StudentBusRoute.init({
    StudentNationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [14, 14]
      }
    },
    BusRouteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IsFullRoute: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "StudentBusRoute",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["StudentNationalId", "BusRouteId"]
      },
      {
        fields: ["BusRouteId", "StudentNationalId"]
      }
    ]
  });
  return StudentBusRoute;
};