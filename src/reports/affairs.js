const { studentsInGrade } = require("../queries/seats");
const { getClasses } = require("../queries/class");
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

const getClassStats = async (classId) => {
  return db["StudentClass"].count({ where: {ClassId: classId} });
};

const getCapacityStats = async () => {
  const classes = await getClasses();
  let stats = {};
  for (let [classId, gradeId] of classes) {
    const classCount = await getClassStats(classId);
    stats[gradeId] ? false : stats[gradeId] = {"total": 0};
    stats[gradeId]["total"] += classCount;
    stats[gradeId][classId] = classCount;
  }
  return stats;
};

const studentsOfColleagues = async () => {
  return db["Student"].findAll({
    required: true,
    include: {
      model: db["Parent"],
      required: true,
      as: "Responsible",
      include: {
        required: true,
        model: db["ParentJob"],
        include: {
          required: true,
          model: db["Job"],
          where: {
            JobName: "Employee"
          },
        }
      },
    },
  }).then(students => students.map(student => student.toJSON()));
};


module.exports = {
  getSeatsData,
  getCapacityStats,
  studentsOfColleagues
};
