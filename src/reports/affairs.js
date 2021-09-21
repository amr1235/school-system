const { studentsInGrade } = require("../queries/seats");
const { getClasses } = require("../queries/class");
const db = require("../db/models");
const { Op } = require("sequelize");

const getSeatsData = async (gradeId) => {
  const { students, count } = await studentsInGrade(gradeId);

  return db["StudentSeat"]
    .findAll({
      where: {
        StudentId: {
          [Op.between]: [students[0].StudentId, students[count - 1].StudentId],
        },
      },
      required: true,
      include: {
        model: db["Student"],
        required: true,
        attributes: ["StudentId", "StudentName"],
      },
    })
    .then((students) => students.map((student) => student.toJSON()))
    .then((results) => {
      return results.map((result) => [
        result.SeatNumber,
        result.Student.StudentName,
      ]);
    });
};

const getClassStats = async (classId) => {
  return db["StudentClass"].count({ where: { ClassId: classId } });
};

const getCapacityStats = async () => {
  const classes = await getClasses();
  let stats = {};
  for (let [classId, gradeId] of classes) {
    const classCount = await getClassStats(classId);
    stats[gradeId] ? false : (stats[gradeId] = { total: 0 });
    stats[gradeId]["total"] += classCount;
    stats[gradeId][classId] = classCount;
  }
  return stats;
};

const studentsOfColleagues = async () => {
  return db["Student"]
    .findAll({
      required: true,
      attributes: ["StudentName"],
      include: [
        {
          model: db["Parent"],
          attributes: ["ParentName"],
          required: true,
          as: "Responsible",
          include: {
            required: true,
            model: db["ParentJob"],
            include: {
              required: true,
              model: db["Job"],
              where: {
                JobName: "Employee",
              },
            },
          },
        },
        {
          required: true,
          model: db["StudentClass"],
          attributes: [],
          include: {
            required: true,
            model: db["Class"],
          },
        },
      ],
    })
    .then((students) => students.map((student) => student.toJSON()));
};

module.exports = {
  getSeatsData,
  getCapacityStats,
  studentsOfColleagues,
};
