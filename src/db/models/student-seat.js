const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentSeat extends Model {
    /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    static associate(models) {
      // define association here
      StudentSeat.belongsTo(models["Student"], {
        foreignKey: "StudentId"
      });
    }
  }
  StudentSeat.init({
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    SeatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    createdAt: false,
    updatedAt: false,
    modelName: "StudentSeat",
    freezeTableName: true,
  });
  return StudentSeat;
};