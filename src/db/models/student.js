const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Student.belongsTo(models["Mother"], {
                foreignKey: "MotherNationalId"
            });
            Student.belongsTo(models["Father"], {
                foreignKey: "FatherNationalId"
            });
            Student.belongsTo(models["BusRoute"], {
                foreignKey: "StudentBusRouteId"
            });
            Student.belongsTo(models["Class"], {
                foreignKey: "StudentClassId"
            });
            Student.belongsTo(models["Governorate"], {
                foreignKey: "StudentBirthGovernorateId"
            });
            Student.belongsTo(models["District"], {
                foreignKey: "StudentBirthDistrictId"
            });
        }
    };
    Student.init({
        StudentNationalId: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                isNumeric: true,
                len: [14, 14]
            }
        },
        StudentName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        StudentBirthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        StudentBirthGovernorateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        StudentBirthDistrictId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        StudentAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        StudentSex: {
            type: DataTypes.ENUM,
            values: ["MALE", "FEMALE"],
            defaultValue: "MALE",
            allowNull: false
        },
        StudentReligion: {
            type: DataTypes.ENUM,
            values: ["MUSLIM", "JEW", "CHRISTIAN"],
            defaultValue: "MUSLIM",
            allowNull: false
        },
        // NOT IMPLEMENTED!!!
        // StudentNationalityId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: "Nationality"
        //     },
        // },
        StudentRegisterDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        StudentSiblingOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        StudentFatherNationalId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [14, 14]
            }
        },
        StudentMotherNationalId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [14, 14]
            }
        },
        // NOT IMPLEMENTED!!!
        // StudentFamilyStatusId: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        StudentClassId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        StudentBusRouteId: DataTypes.INTEGER,
        IsFullBusRoute: DataTypes.BOOLEAN,
        IsRegistered: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        RemainingCost: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
        sequelize,
        updatedAt: false,
        createdAt: false,
        modelName: 'Student',
        freezeTableName: true
    });
    return Student;
};