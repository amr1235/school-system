const db = require("../db/models");
const { mapToJSON } = require("./utlis");
const { Op } = require("sequelize");

const generateStudentSeats = async (gradeId, start, step) => {
  return db.sequelize.transaction(async (t) => {
    const { count, students } = await studentsInGrade(gradeId);
    let studentsIds = students.map(std => std.StudentId);
    await db["StudentSeat"].destroy({
      where : {
        StudentId : {
          [Op.in] : studentsIds
        }
      },
      transaction : t
    });
    let seats = [];
    for (let i = 0; i < count; i++) {
      seats[i] = {
        StudentId: students[i].StudentId,
        SeatNumber: start + (i * step),
      };
    }
    return db["StudentSeat"]
      .bulkCreate(seats, { transaction: t })
      .then(mapToJSON);
  });
};

const studentsInGrade = (gradeId) => {
  return db["Student"]
    .findAndCountAll({
      attributes: ["StudentId"],
      include: {
        attributes: [],
        model: db["StudentClass"],
        include: {
          attributes: [],
          model: db["Class"],
          where: {
            GradeId: gradeId,
          },
          required: true,
        },
        required: true,
      },
      order: [["StudentName", "ASC"]],
      required: true,
    })
    .then((res) => {
      return { students: mapToJSON(res.rows), count: res.count };
    });
};

const getStudentSeat = async (StudentId) => {
  return db["StudentSeat"]
    .findOne({
      where: {
        StudentId: StudentId,
      },
    })
    .then((res) => res.toJSON());
};
module.exports = {
  generateStudentSeats,
  getStudentSeat,
  studentsInGrade,
};
