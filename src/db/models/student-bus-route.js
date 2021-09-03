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
        foreignKey: "StudentId"
      });
      StudentBusRoute.belongsTo(models["BusRoute"], {
        foreignKey: "BusRouteId"
      });
    }
  }
  StudentBusRoute.init({
    StudentId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true
    },
    BusRouteId: {
      type: DataTypes.INTEGER,
      primaryKey: true
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
        fields: ["BusRouteId", "StudentId"]
      }
    ]
  });
  return StudentBusRoute;
};