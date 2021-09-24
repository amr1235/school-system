const { Op } = require("sequelize");
const db = require("../db/models/index");
const parent = require("./parent");
const absent = require("./absent");

const { mapToJSON } = require("./utlis");

// get all data needed to show the student 
const getStudentData = async (Id) => {
  let studentData = await getStudentsByColumnMultipleVals("StudentId", [Id]);
  studentData = studentData[0];
  let fatherData = null;
  let motherData = null;
  let resData = null;
  // get nationalty 
  let nationalities = await db["Nationality"].findAll();
  let nationality = await db["Nationality"].findOne({
    where: {
      NationalityId: studentData.StudentNationalityId
    }
  });
  nationality = nationality.dataValues;
  nationalities = mapToJSON(nationalities);
  // get fatherData 
  let StudentFatherId = studentData.StudentFatherId;
  if (StudentFatherId) {
    fatherData = await parent.getParentById(StudentFatherId);
  }
  // get fatherData 
  let StudentMotherId = studentData.StudentMotherId;
  if (StudentMotherId) {
    motherData = await parent.getParentById(StudentMotherId);
  }
  // resp data 
  let StudentResponsibleId = studentData.StudentResponsibleId;
  if (StudentResponsibleId) {
    resData = await parent.getParentById(StudentResponsibleId);
  }
  // get all stages , grades and classes
  let stagesData = await db["Stage"].findAll({
    attributes: ["StageId", "StageName"],
    include: {
      model: db["Grade"],
      attributes: ["GradeId", "GradeName"],
      include: {
        model: db["Class"],
        attributes: ["ClassId"]
      }
    }
  });
  stagesData = mapToJSON(stagesData);
  // get class of the student 
  let ClassId = await db["StudentClass"].findOne({
    attributes: ["ClassId"],
    where: {
      StudentId: Id,
    }
  });
  ClassId = ClassId.ClassId;
  let GradeId = await db["Class"].findOne({
    attributes: ["GradeId"],
    where: {
      ClassId
    }
  });
  GradeId = GradeId.GradeId;
  let StageId = await db["Grade"].findOne({
    attributes: ["StageId"],
    where: {
      GradeId
    }
  });
  StageId = StageId.StageId;
  let studentClass = {
    StageId,
    GradeId,
    ClassId
  };
  //get all jobs 
  let jobs = await db["Job"].findAll();
  jobs = mapToJSON(jobs);
  // get resData
  // get absent data 
  let absentReasons = await absent.getAllReasons();
  let studentAbsent = await absent.getStudentAbsenceDays(Id);
  let data = {
    ...studentData,
    studentId : Id,
    nationality,
    nationalities,
    fatherData,
    motherData,
    resData,
    stagesData,
    studentClass,
    jobs,
    absentReasons,
    studentAbsent
  };
  // get absent data 
  return data;
};
// eslint-disable-next-line no-unused-vars
const getAllStudents = () => {
  return db["Stage"].findAll({
    attributes: ["StageId", "StageName"],
    include: {
      model: db["Grade"],
      attributes: ["GradeId", "GradeName"],
      include: {
        model: db["Class"],
        attributes: ["ClassId"],
        include: {
          model: db["StudentClass"],
          attributes: ["StudentId"],
          include: {
            model: db["Student"],
            attributes: ["StudentName"]
          }
        }
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
      console.log("father");
    }
    // check if there is a mother 
    if (motherData) {
      let mother = await parent.addParent(motherData, t);
      StudentMotherId = mother.ParentId;
      console.log("mother");
    }
    if (responsibleParentData[0] === "father") {
      StudentResponsibleId = StudentFatherId;
      StudentResponsibleRelation = "father";
    } else if (responsibleParentData[0] === "mother") {
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
        await parent.updateParentById(StudentFatherId,newFatherData,t);
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
        await parent.updateParentById(StudentMotherId,newMotherData,t);
      }
    }
    // check if ther ia new res data if  so update it 
    let StudentResponsibleRelation = "";
    if (newResponsibleParentData) {
      if (newResponsibleParentData[0] === "father") {
        StudentResponsibleId = StudentFatherId;
        StudentResponsibleRelation = "father";
      } else if (newResponsibleParentData[0] === "mother") {
        StudentResponsibleId = StudentMotherId;
        StudentResponsibleRelation = "mother";
      } else {
        // update Responsible Parent
        await parent.updateParentById(StudentResponsibleId,newResponsibleParentData[1],t);
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
    await db["Student"].update(newStudentData, {
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
      attributes: ["GradeId"],
      where: {
        StageId: firstStageId
      }
    });
    Grades = Grades.map(g => g.dataValues.GradeId).sort();
    let firstGradeId = Grades[0];
    await db["Class"].bulkCreate([{ GradeId: firstGradeId }, { GradeId: firstGradeId }], { transaction: t });
    return "Students have been upgraded";
  });
};
const transferStudent = (StudentId,SchoolName) => {
  return db.sequelize.transaction(t => {
    // delete student from student class
    let proms = [];
    let currentDate = new Date();
    proms.push(db["StudentClass"].destroy({
      where : {
        StudentId
      },
      transaction : t
    }));
    proms.push(db["TransferredStudent"].create({
      StudentId,
      SchoolName,
      TransferDate : currentDate.toISOString()
    },{
      transaction : t
    }));
    return Promise.all(proms);
  });
};
module.exports = {
  getAllStudents,
  addNewStudent,
  updateStudentByStudentId,
  upgradeStudentsToNextGrade,
  getStudentsByColumnMultipleVals,
  getStudentData,
  transferStudent
};