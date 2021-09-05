const { Op } = require("sequelize");
const db = require("../db/models/index");
const parent = require("./parent");

const mapToJSON = payload => {
  return payload.map(item => item.toJSON());
};
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
      let father = await parent.addParent(fatherData,t);
      StudentFatherId = father.ParentId;
    }
    // check if there is a father 
    if (motherData) {
      let mother = await parent.addParent(motherData,t);
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
      let responsible = await parent.addParent(responsibleParentData[1],t);
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
    let student = await db["Student"].create(studentData,{transaction:t});
    student = student.dataValues;
    let StudentId = student.StudentId;
    // add class info
    await db["StudentClass"].create({
      StudentId,
      ClassId
    },{transaction:t});
    return student;
  });
};

//update student by nationalId 
// const updateStudentByNationalId = (nationalID,data) => {
//   return new Promise((res,rej) => {
//     db["Student"].update(data,{
//       where : {
//         StudentNationalId : nationalID
//       }
//     }).then(std => res(std)).catch(err => rej(err));
//   });
// }
// This shoould be done in a different way
// const addFatherInfo = (studentSSN, fatherName, ssn = null, passport = null, address, nationality, academicDegree, job, isAColleage, phones) => {
//   db["Parent"].create({
//     ParentName: fatherName,
//     ParentNationalId: ssn,
//     ParentPassportId: passport,
//     ParentAddress: address,
//     ParentNationalityId: nationality,
//     ParentAcademicDegree: academicDegree,

//   })
//     .then(father => father.toJSON())
//     .then(father => {

//     });
// };

// getAllStudents().then(console.log);
// addNewStudent("Ramadan Ibrahem", "12651122334455", null, "1998-11-30", "Cairo", "30 Ahmed Dawood St., Cairo, Egypt", "MALE", 1, 2, 1, "MARRIED").then(console.log);
// getStudentByColumn("StudentName", "Ali").then(console.log).then(console.log);
// getStudentsByColumnMultipleVals("StudentFamilyStatus", ["ORPHAN"]).then(console.log);
module.exports = {
  addNewStudent
};