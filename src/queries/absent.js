const db = require("../db/models/index");
const { Op } = require("sequelize");

const addNewAbsenceDay = async (StudentId, AbsentReasonName, AbsentDate) => {
  const AbsentReason = await db["AbsentReason"].findOrCreate({
    where: {
      AbsentReasonName: AbsentReasonName
    }
  });

  let AbsentReasonId = AbsentReason[0].dataValues.AbsentReasonId;

  const absenceData = {
    AbsentReasonId: AbsentReasonId,
    StudentId: StudentId,
    AbsentDate: AbsentDate
  };

  const student = await db["Student"].findByPk(StudentId);
  const absenceDays = await student.countStudentAbsents();
  const warnings = await student.countStudentWarnings();
  const perWarning = 10;

  if (absenceDays - warnings * perWarning >= perWarning) {
    return await db.sequelize.transaction(async (t) => {
      const absent = await db["StudentAbsent"].create(absenceData, { transaction: t });
      const newWarning = await db["StudentWarning"].create({
        StudentId: StudentId,
        WarningDate: AbsentDate
      }, { transaction: t });
      return [absent, newWarning];
    });
  } else {
    return [db["StudentAbsent"].create(absenceData), {}];
  }
};

const getStudentAbsenceDays = async (StudentId) => {
  return db["StudentAbsent"].findAll({
    where: {
      StudentId
    }
  });
};

const getAbsenceBetween = async (StudentId, startingDate, endingDate) => {
  return db["StudentAbsent"].findAll({
    where: {
      StudentId,
      AbsentDate: {
        [Op.between]: [startingDate, endingDate]
      }
    }
  });
};

const getAllWarnings = async (StudentId) => {
  return db["StudentWarning"].findAll({
    where: {
      StudentId
    }
  });
};

const sendWarning = async (StudentId, WarningDate) => {
  return db["StudentWarning"].update({ IsRecieved: true }, {
    where: {
      StudentId,
      WarningDate: WarningDate
    }
  });
};

const deleteWarning = async (StudentId, WarningDate) => {
  return db["StudentWarning"].destroy({
    where: {
      StudentId,
      WarningDate: WarningDate
    }
  });
};

sendWarning(1, "2012-01-09").then(console.log);

module.exports = {
  addNewAbsenceDay,
  getStudentAbsenceDays,
  getAbsenceBetween,
  getAllWarnings,
  sendWarning,
  deleteWarning
};