const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mother extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Mother.hasMany(models["Student"], {
                foreignKey: "MotherNationalId"
            })
            Mother.belongsTo(models["AcademicDegree"], {
                foreignKey: "MotherAcademicDegreeId",
            });
            Mother.belongsTo(models["Job"], {
                foreignKey: "MotherJobId",
            });
        }
    };
    Mother.init({
        MotherNationalId: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                isNumeric: true,
                
                len:[14,14]
            }
        },
        MotherName: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isAlpha: true
            // }
        },
        MotherAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // MotherNationalityId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        MotherAcademicDegreeId: {
            type: DataTypes.INTEGER,
        },
        MotherJobId: {
            type: DataTypes.INTEGER,
        },
        MotherJobAddress: {
            type: DataTypes.STRING,
        },
        IsEmployee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        updatedAt: false,
        createdAt: false,
        modelName: 'Mother',
        freezeTableName: true,
    });
    return Mother
};