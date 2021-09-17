const { studentsInGrade } = require("../queries/seats");
const db = require("../db/models");
const { Op } = require("sequelize");

const getSeatsData = async (gradeId) => {
  const { students, count } = await studentsInGrade(gradeId);
  return db["StudentSeat"].findAll({ where: {
    StudentId: {
      [Op.between]: [students[0].StudentId, students[count - 1].StudentId]
    }
  } }).then(seats => seats.map(seat => seat.toJSON()));
};


module.exports = {
  getSeatsData,
};
