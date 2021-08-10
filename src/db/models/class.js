const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Class.hasOne(models["Student"], {
                foreignKey: "StudentClassId"
            });
        }
    };
    Class.init({
        ClassId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ClassCapacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        GradeNumber: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 6
            },
            allowNull: false
        },
        StageName: {
            type: DataTypes.ENUM,
            values: ["NURSERY","KG","PRIMARY","PREP","SECONDARY"],
            allowNull: false
        }
    }, {
        sequelize,
        updatedAt: false,
        createdAt: false,
        modelName: 'Class',
        freezeTableName: true,
    });
    return Class
};