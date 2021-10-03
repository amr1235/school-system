const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusRoute extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      BusRoute.hasMany(models["StudentBusRoute"], {
        foreignKey: "BusRouteId"
      });
    }
  }
  BusRoute.init({
    BusRouteId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    BusRouteName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BusRouteDriverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BusRouteCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: "BusRoute",
    freezeTableName: true,
  });
  return BusRoute;
};