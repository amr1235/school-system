const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BusRoute extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BusRoute.hasMany(models["Student"], {
                foreignKey: "BusRouteId"
            })
        }
    };
    BusRoute.init({
        BusRouteId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        BusRouteName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        BusRouteCost: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    }, {
        sequelize,
        updatedAt: false,
        createdAt: false,
        modelName: 'BusRoute',
        freezeTableName: true,
    });
    return BusRoute
};