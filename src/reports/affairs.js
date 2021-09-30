const { studentsInGrade } = require("../queries/seats");
// const { getClasses } = require("../queries/class");
const { getAbsenceBetween } = require("../queries/absent");
const { getGrades } = require("../queries/grade");
const db = require("../db/models");
const { Op } = require("sequelize");

const dateDiffIndays = (date1, date2) => {
  const dt1 = new Date(date1);
  const dt2 = new Date(date2);
  return (
    Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24),
    ) + 1
  );
};

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
      order: [["SeatNumber", "ASC"]],
    })
    .then((students) => students.map((student) => student.toJSON()))
    .then((results) => {
      return results.map((result) => [
        result.SeatNumber,
        result.Student.StudentName,
      ]);
    });
};

// const getClassStats = async (classId) => {
//   return db["StudentClass"].count({ where: { ClassId: classId } });
// };

// const getCapacityStats = async () => {
//   const classes = await getClasses();

//   let stats = [];
//   for (let [classId, gradeId] of classes) {
//     const classCount = await getClassStats(classId);
//     stats[gradeId] ? false : (stats[gradeId] = { total: 0 });
//     stats[gradeId]["total"] += classCount;
//     stats[gradeId][classId] = classCount;
//   }
//   return stats;
// };

const getGradeCapacity = async (gradeId) => {
  return db.sequelize.transaction(async (t) => {
    let promises = [];
    let classes = await db["Class"].findAll(
      {
        attributes: ["ClassId"],
        where: {
          GradeId: gradeId,
        },
        include: {
          model: db["Grade"],
          attributes: ["GradeName"],
        },
        order: [["ClassId", "ASC"]],
      },
      { transaction: t },
    );
    classes = classes.map((clas) => clas.toJSON());
    for (const clas of classes) {
      promises.push(
        db["StudentClass"]
          .count({ where: { ClassId: clas["ClassId"] } }, { transaction: t })
          .then((count) => {
            return [clas["ClassId"], count];
          }),
      );
    }
    return Promise.all(promises).then((c) => {
      const total = c.reduce((sum, clas) => sum + clas[1], 0);
      let classs = 1;
      c = c.map((clas) => {
        clas[0] = classs;
        classs = classs + 1;
        return clas;
      });
      c.unshift([`مجموع ${classes[0]["Grade"]["GradeName"]}`, total]);
      return c;
    });
  });
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

const getStudentAbsenceRatio = async (StudentId, startingData, endingDate) => {
  const student = await db["Student"].findAll({
    where: {
      StudentId: StudentId,
    },
    attributes: ["StudentName"],
  });
  return getAbsenceBetween(StudentId, startingData, endingDate).then(
    (dates) => {
      return {
        studentName: student[0].dataValues["StudentName"],
        absentDays: dates.length,
        ratio:
          (dates.length / dateDiffIndays(startingData, endingDate)) * 100 +
          " %",
      };
    },
  );
};

const CountStudentsInGrade = async (gradeId) => {
  const { count } = await db["Student"].findAndCountAll({
    include: {
      model: db["StudentClass"],
      required: true,
      include: {
        model: db["Class"],
        required: true,
        where: {
          GradeId: gradeId,
        },
      },
    },
  });
  return count;
};

const getAllAbsenceInGrade = async (gradeId, startingDate, endingDate) => {
  const { count } = await db["StudentAbsent"].findAndCountAll({
    required: true,
    where: {
      AbsentDate: {
        [Op.between]: [startingDate, endingDate],
      },
    },
    include: {
      model: db["Student"],
      required: true,
      include: {
        model: db["StudentClass"],
        required: true,
        include: {
          model: db["Class"],
          required: true,
          where: {
            GradeId: gradeId,
          },
        },
      },
    },
  });

  const studentCount = await CountStudentsInGrade(gradeId);
  return [count, studentCount];
};

const getAbsenceRatioInAllGrades = async (startingDate, endingDate) => {
  const promises = [];
  return getGrades()
    .then((grades) => {
      grades.map((grade) => {
        promises.push(
          getAllAbsenceInGrade(grade[0], startingDate, endingDate).then(
            ([Absencecount, studentCount]) => {
              return [
                grade[1],
                Absencecount,
                (Absencecount /
                  (dateDiffIndays(startingDate, endingDate) * studentCount)) *
                  100 +
                  " %",
              ];
            },
          ),
        );
      });
    })
    .then(() => {
      return Promise.all(promises);
    });
};

const getTransferredStudents = async (notBefore) => {
  let startingDate = "1970-01-01";
  if (notBefore) {
    startingDate = notBefore;
  }
  return db["TransferredStudent"]
    .findAll({
      attributes: ["TransferDate", "SchoolName"],
      include: {
        model: db["Student"],
        attributes: ["StudentName"],
        order: [["StudentName", "ASC"]],
      },
      where: {
        TransferDate: {
          [Op.gt]: startingDate,
        },
      },
      order: [["TransferDate", "DESC"]],
    })
    .then((students) =>
      students.map((student) => {
        const s = student.toJSON();
        return [
          s["Student"]["StudentName"],
          s["SchoolName"],
          s["TransferDate"],
        ];
      }),
    );
};

const AbsentDays = async () => {
  return db["StudentAbsent"]
    .findAll({
      attributes: ["AbsentDate"],
      include: [
        {
          model: db["Student"],
          attributes: ["StudentName"],
          order: [["StudentName", "ASC"]],
          include: {
            model: db["StudentClass"],
            attributes: ["ClassId"],
            order: [["ClassId", "ASC"]],
            include: {
              model: db["Class"],
              attributes: ["ClassId"],
              order: [["ClassId", "ASC"]],
              include: {
                model: db["Grade"],
                attributes: ["GradeName"],
                order: [["GradeName", "ASC"]],
              },
            },
          },
        },
        {
          model: db["AbsentReason"],
          attributes: db["AbsentReasonName"],
        },
      ],
      order: [["AbsentDate", "DESC"]],
    })
    .then((dates) =>
      dates.map((date) => {
        const data = date.toJSON();
        console.log(data);
        return [
          data["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          data["Student"]["StudentClass"]["Class"]["ClassId"],
          data["Student"]["StudentName"],
          data["AbsentReason"]["AbsentReasonName"],
          data["AbsentDate"],
        ];
      }),
    );
};

module.exports = {
  getSeatsData,
  // getCapacityStats,
  getGradeCapacity,
  studentsOfColleagues,
  getStudentAbsenceRatio,
  getAbsenceRatioInAllGrades,
  getTransferredStudents,
  AbsentDays,
};
