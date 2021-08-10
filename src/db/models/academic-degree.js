const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AcademicDegree extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            AcademicDegree.hasMany(models["Father"], {
                foreignKey: "FatherAcademicDegreeId"
            });
            AcademicDegree.hasMany(models["Mother"], {
                foreignKey: "MotherAcademicDegreeId"
            });
        }
    };
    AcademicDegree.init({
        AcademicDegreeId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        AcademicDegreeName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        createdAt: false,
        updatedAt: false,
        modelName: 'AcademicDegree',
        freezeTableName: true,
    });
    return AcademicDegree
};