const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Father extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Father.hasMany(models["Student"], {
                foreignKey: "FatherNationalId"
            })
            Father.belongsTo(models["AcademicDegree"], {
                foreignKey: "FatherAcademicDegreeId",
            });
            Father.belongsTo(models["Job"], {
                foreignKey: "FatherJobId",
            });
        }
    };
    Father.init({
        FatherNationalId: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                isNumeric: true,
                len:[14,14]
            }
        },
        FatherName: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isAlpha: true
            // }
        },
        FatherAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // FatherNationalityId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        FatherAcademicDegreeId: {
            type: DataTypes.INTEGER,
        },
        FatherJobId: {
            type: DataTypes.INTEGER,
        },
        FatherJobAddress: {
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
        modelName: 'Father',
        freezeTableName: true,
    });
    return Father
};