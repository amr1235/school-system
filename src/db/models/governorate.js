const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Governorate extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Governorate.hasMany(models["Student"], {
                foreignKey: "StudentBirthGovernorateId"
            });
        }
    };
    Governorate.init({
        GovernorateId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        GovernorateName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        updatedAt: false,
        createdAt: false,
        modelName: 'Governorate',
        freezeTableName: true,
    });
    return Governorate
};