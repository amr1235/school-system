const { Op } = require("sequelize");
const db = require("../db/models/index");
const parent = require("./parent");

const { mapToJSON } = require("./utlis");
// eslint-disable-next-line no-unused-vars
const getAllStudents = () => {
  return db["Student"].findAll().then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getStudentsByColumnOneVal = (column, val) => {
  return db["Student"].findAll({
    where: {
      [column]: {
        [Op.like]: `%${val}%`,
      }
    }
  }).then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getStudentsByColumnMultipleVals = (column, vals) => {
  // console.log(vals);
  return db["Student"].findAll({
    where: {
      [column]: {
        [Op.in]: vals,
      }
    }
  }).then(mapToJSON);
};

// eslint-disable-next-line no-unused-vars
const addNewStudent = async (fatherData, motherData, responsibleParentData, studentData, ClassId) => {
  return await db.sequelize.transaction(async (t) => {
    // responsibleParentData should be like this ['father',{empty}] or ['mother',{empty}] or ['other',{otherData}] first is StudentResponsibleRelation and second is the data of that parent
    let StudentFatherId = null;
    let StudentMotherId = null;
    let StudentResponsibleId = null;
    let StudentResponsibleRelation = "";
    // check if there is a father 
    if (fatherData) {
      let father = await parent.addParent(fatherData, t);
      StudentFatherId = father.ParentId;
    }
    // check if there is a father 
    if (motherData) {
      let mother = await parent.addParent(motherData, t);
      StudentMotherId = mother.ParentId;
    }
    if (responsibleParentData[0] == "father") {
      StudentResponsibleId = StudentFatherId;
      StudentResponsibleRelation = "father";
    } else if (responsibleParentData[0] == "mother") {
      StudentResponsibleId = StudentMotherId;
      StudentResponsibleRelation = "mother";
    } else {
      // if the Responsible is not his mother or his father create another parent
      let responsible = await parent.addParent(responsibleParentData[1], t);
      StudentResponsibleId = responsible.ParentId;
      StudentResponsibleRelation = responsibleParentData[0];
    }
    // add parent info
    studentData = {
      ...studentData,
      StudentFatherId,
      StudentMotherId,
      StudentResponsibleId,
      StudentResponsibleRelation
    };
    console.log(studentData);
    // create student
    let student = await db["Student"].create(studentData, { transaction: t });
    student = student.dataValues;
    let StudentId = student.StudentId;
    // add class info
    await db["StudentClass"].create({
      StudentId,
      ClassId
    }, { transaction: t });
    return student;
  });
};

//update student by studentId
const updateStudentByStudentId = async (StudentId, newFatherData, newMotherData, newResponsibleParentData, newStudentData, newClassId) => {
  return await db.sequelize.transaction(async (t) => {
    // get StudentFatherId , StudentMotherId , StudentResponsibleId
    let { StudentFatherId, StudentMotherId, StudentResponsibleId } = await db["Student"].findOne({
      attributes: ["StudentFatherId", "StudentMotherId", "StudentResponsibleId"],
      where: {
        StudentId: StudentId
      }
    }, { transaction: t });
    // check if ther ia new father data if  so update it 
    if (newFatherData) {
      // check if the student has a father 
      if (!StudentFatherId) {
        // create new parent with the data 
        let father = await parent.addParent(newFatherData, t);
        StudentFatherId = father.toJSON().ParentId;
      } else {
        // update father with the new data 
        await db["Parent"].update(newFatherData, {
          where: {
            ParentId: StudentFatherId
          },
          transaction: t
        });
      }
    }
    // check if ther ia new mother data if  so update it 
    if (newMotherData) {
      // check if the student has a mother
      if (!StudentMotherId) {
        // create new parent with the data 
        let mother = await parent.addParent(newMotherData, t);
        StudentMotherId = mother.toJSON().ParentId;
        // update StudentFatherId
        await db["Student"].update({
          StudentMotherId
        }, {
          where: {
            StudentId
          },
          transaction: t
        });
      } else {
        // update mother with the new data 
        await db["Parent"].update(newMotherData, {
          where: {
            ParentId: StudentMotherId
          },
          transaction: t
        });
      }
    }
    // check if ther ia new res data if  so update it 
    let StudentResponsibleRelation = "";
    if (newResponsibleParentData) {
      if (newResponsibleParentData[0] == "father") {
        StudentResponsibleId = StudentFatherId;
        StudentResponsibleRelation = "father";
      } else if (newResponsibleParentData[0] == "mother") {
        StudentResponsibleId = StudentMotherId;
        StudentResponsibleRelation = "mother";
      } else {
        // update Responsible Parent
        await db["Parent"].update(newResponsibleParentData[1], {
          where: {
            ParentId: StudentResponsibleId
          },
          transaction: t
        });
        StudentResponsibleRelation = newResponsibleParentData[0];
      }
    }
    // update new student data
    newStudentData = {
      ...newStudentData,
      StudentFatherId,
      StudentMotherId,
      StudentResponsibleId,
      StudentResponsibleRelation
    };
    let student = db["Student"].update(newStudentData, {
      where: {
        StudentId
      },
      transaction: t
    });
    // if there is new classId update it 
    if (newClassId) {
      await db["StudentClass"].update({
        ClassId: newClassId
      }, {
        where: {
          StudentId
        },
        transaction: t
      });
    }
    return student.toJSON();
  });
};
const upgradeStudentsToNextGrade = async () => {
  return await db.sequelize.transaction(async (t) => {
    let Stages = await db["Stage"].findAll({
      attributes: ["StageId"],
    });
    Stages = Stages.map(s => s.dataValues.StageId).sort().reverse();
    for (let i = 0; i < Stages.length; i++) {
      const StageId = Stages[i];
      let Grades = await db["Grade"].findAll({
        attributes: ["GradeId"],
        where: {
          StageId
        }
      });
      Grades = Grades.map(g => g.dataValues.GradeId).sort().reverse();
      for (let j = 0; j < Grades.length; j++) {
        const GradeId = Grades[j];
        let nextGradeId = Grades[j - 1];
        if (!nextGradeId) {
          let nextStageId = Stages[i - 1];
          if (!nextStageId) {
            // graduate last classes 
            await db["Class"].destroy({
              where: {
                GradeId
              },
              transaction: t
            });
            // update exit date
            continue;
          }
          let GradesOfNextStage = await db["Grade"].findAll({
            attributes: ["GradeId"],
            where: {
              StageId: nextStageId
            }
          });
          nextGradeId = GradesOfNextStage.map(g => g.dataValues.GradeId).sort()[0];
        }
        // update all classes with new grade Id 
        await db["Class"].update({
          GradeId: nextGradeId
        }, {
          where: {
            GradeId
          },
          transaction: t
        });
      }
    }
    // adde new 2 classes at first grade
    let firstStageId = Stages[Stages.length - 1];
    let Grades = await db["Grade"].findAll({
      attributes:["GradeId"],
      where : {
        StageId : firstStageId
      }
    });
    Grades = Grades.map(g => g.dataValues.GradeId).sort();
    let firstGradeId = Grades[0];
    await db["Class"].bulkCreate([{GradeId : firstGradeId},{GradeId : firstGradeId}],{transaction:t});
    return "Students have been upgraded";
  });
};
module.exports = {
  addNewStudent,
  updateStudentByStudentId,
  upgradeStudentsToNextGrade
};