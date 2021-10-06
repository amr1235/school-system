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

  const student = await db["Student"].findOne({
    where: {
      StudentId
    },
    include: [db["StudentWarning"], db["StudentAbsent"]],
  });

  const absenceDays = student.dataValues.StudentAbsents.length;
  const warnings = student.dataValues.StudentWarnings.length;
  const perWarning = 10;

  if (absenceDays - warnings * perWarning >= perWarning - 1) {
    return await db.sequelize.transaction(async (t) => {
      const absent = await db["StudentAbsent"].create(absenceData, { transaction: t });
      const newWarning = await db["StudentWarning"].create({
        StudentId: StudentId,
        WarningDate: AbsentDate
      }, { transaction: t });
      return ([absent, newWarning]).map(data => data.toJSON());
    });
  } else {
    return db["StudentAbsent"].create(absenceData).then(date => date.toJSON());
  }
};
const updateAbsenceReason = (StudentId, AbsentDate, newReasonId) => {
  return db["StudentAbsent"].update({
    AbsentReasonId: newReasonId
  }, {
    where: {
      StudentId,
      AbsentDate
    }
  });
};
const deleteAbsence = (StudentId, AbsentDate) => {
  // destroy any warning 
  return db.sequelize.transaction((t) => {
    let proms = [];
    proms.push(db["StudentWarning"].destroy({
      where : {
        StudentId,
        WarningDate : AbsentDate
      }
    }));
    proms.push(db["StudentAbsent"].destroy({
      where : {
        StudentId,
        AbsentDate
      }
    }));
    return Promise.all(proms);
  });
};
const getStudentAbsenceDays = async (StudentId) => {
  return db["StudentAbsent"].findAll({
    where: {
      StudentId
    },
    order : [['AbsentDate',"DESC"]]
  }).then(dates => dates.map(date => date.toJSON()));
};

const getAbsenceBetween = async (StudentId, startingDate, endingDate) => {
  return db["StudentAbsent"].findAll({
    where: {
      StudentId,
      AbsentDate: {
        [Op.between]: [startingDate, endingDate]
      }
    }
  }).then(dates => dates.map(date => date.toJSON()));
};

const getAllWarnings = async (StudentId) => {
  return db["StudentWarning"].findAll({
    where: {
      StudentId
    },
    order : [['WarningDate',"DESC"]]
  }).then(warnings => warnings.map(warning => warning.toJSON()));
};

const sendWarning = async (StudentId, WarningDate) => {
  return db["StudentWarning"].update({ IsRecieved: true }, {
    where: {
      StudentId,
      WarningDate: WarningDate
    }
  });
};
const receiveWarning = (StudentId, WarningDate) => {
  return db["StudentWarning"].update({
    IsRecieved : true
  },{
    where : {
      StudentId,
      WarningDate
    }
  });
}
const deleteWarning = async (StudentId, WarningDate) => {
  return db["StudentWarning"].destroy({
    where: {
      StudentId,
      WarningDate: WarningDate
    }
  });
};
const getAllReasons = () => {
  return db["AbsentReason"].findAll({
    attributes: ["AbsentReasonId", "AbsentReasonName"]
  }).then(Reasons => Reasons.map(reason => reason.toJSON()));
};
const addAbsentReason = (AbsentReasonName) => {
  return db["AbsentReason"].create({AbsentReasonName});
};
module.exports = {
  addNewAbsenceDay,
  getStudentAbsenceDays,
  getAbsenceBetween,
  getAllWarnings,
  sendWarning,
  deleteWarning,
  getAllReasons,
  updateAbsenceReason,
  deleteAbsence,
  addAbsentReason,
  receiveWarning
};