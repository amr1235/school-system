const { Op } = require("sequelize");
const db = require("../db/models/index");

const mapToJSON = payload => {
  return payload.map(item => item.toJSON());
};
// eslint-disable-next-line no-unused-vars
const getAllStudents = () => {
  return new Promise((res,rej) => {
    db["Student"].findAll().then(students => {
      students = mapToJSON(students);
      res(students);
    }).catch(err => rej(err));
  });
  // return db["Student"].findAll().then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getStudentsByColumnOneVal = (column, val) => {
  return new Promise((res,rej) => {
    db["Student"].findAll({
      where: {
        [column]: {
          [Op.like]: `%${val}%`,
        }
      }
    }).then(stds => {
      stds = mapToJSON(stds);
      res(stds);
    }).catch(err => rej(err));
  });
  // return db["Student"].findAll({
  //   where: {
  //     [column]: {
  //       [Op.like]: `%${val}%`,
  //     }
  //   }
  // }).then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getStudentsByColumnMultipleVals = (column, vals) => {
  return new Promise((res,rej) => {
    db["Student"].findAll({
      where: {
        [column]: {
          [Op.in]: vals,
        }
      }
    }).then(stds => {
      stds = mapToJSON(stds);
      res(stds);
    }).catch(err => rej(err));
  });
  // console.log(vals);
  // return db["Student"].findAll({
  //   where: {
  //     [column]: {
  //       [Op.in]: vals,
  //     }
  //   }
  // }).then(mapToJSON);
};

// eslint-disable-next-line no-unused-vars
const addNewStudent = (studentName, ssn = null, passport = null,
  dob, city, studentAddress, studentGender, studentNationality,
  studentOrder, breadwinner, familyStatus) => {
  // const studentClassId = db["Class"].findOne({
  //   where: {
  //     StageName: studentLevel,
  //     GradeNumber: studentGrade,
  //   }
  // });
  return new Promise((res,rej) => {
    db["Student"].create({
      StudentNationalId: ssn,
      StudentName: studentName,
      StudentBirthDate: dob,
      StudentBirthPlace: city,
      StudentAddress: studentAddress,
      StudentSex: studentGender,
      StudentNationalityId: studentNationality,
      StudentRegisterDate: "2021-08-26",
      StudentSiblingOrder: studentOrder,
      StudentResponsibleId: breadwinner,
      StudentResponsibleRelation: "FATHER",
      StudentFamilyStatus: familyStatus,
      // StudentClass: studentClassId,
    }).then(std => res(std)).catch(err => rej(err));
  });
  // return db["Student"].create({
  //   StudentNationalId: ssn,
  //   StudentName: studentName,
  //   StudentBirthDate: dob,
  //   StudentBirthPlace: city,
  //   StudentAddress: studentAddress,
  //   StudentSex: studentGender,
  //   StudentNationalityId: studentNationality,
  //   StudentRegisterDate: "2021-08-26",
  //   StudentSiblingOrder: studentOrder,
  //   StudentResponsibleId: breadwinner,
  //   StudentResponsibleRelation: "FATHER",
  //   StudentFamilyStatus: familyStatus,
  //   // StudentClass: studentClassId,
  // });
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