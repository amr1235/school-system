const { Op } = require("sequelize");
const db = require("../db/models/index");
const parent = require("./parent");
const absent = require("./absent");
const instal = require("./installment");
const Bus = require("./BusRoutes");

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
      NationalityId: studentData.StudentNationalityId,
    },
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
        attributes: ["ClassId","ClassName"],
      },
    },
  });
  stagesData = mapToJSON(stagesData);
  // get class of the student
  let ClassId = await db["StudentClass"].findOne({
    attributes: ["ClassId"],
    where: {
      StudentId: Id,
    },
  });
  ClassId = ClassId.ClassId;
  let GradeId = await db["Class"].findOne({
    attributes: ["GradeId"],
    where: {
      ClassId,
    },
  });
  GradeId = GradeId.GradeId;
  let StageId = await db["Grade"].findOne({
    attributes: ["StageId"],
    where: {
      GradeId,
    },
  });
  StageId = StageId.StageId;
  let studentClass = {
    StageId,
    GradeId,
    ClassId,
  };
  //get all jobs
  let jobs = await db["Job"].findAll();
  jobs = mapToJSON(jobs);
  // get resData
  // get absent data
  let absentReasons = await absent.getAllReasons();
  let studentAbsent = await absent.getStudentAbsenceDays(Id);
  // get warnings
  let StudentWarnings = await absent.getAllWarnings(Id);
  let data = {
    ...studentData,
    studentId: Id,
    nationality,
    nationalities,
    fatherData,
    motherData,
    resData,
    stagesData,
    studentClass,
    jobs,
    absentReasons,
    studentAbsent,
    StudentWarnings
  };
  // get absent data
  return data;
};
// eslint-disable-next-line no-unused-vars
const getAllStudents = () => {
  return db["Stage"]
    .findAll({
      attributes: ["StageId", "StageName"],
      include: {
        model: db["Grade"],
        attributes: ["GradeId", "GradeName"],
        include: {
          model: db["Class"],
          attributes: ["ClassId","ClassName"],
          include: {
            model: db["StudentClass"],
            attributes: ["StudentId"],
            include: {
              model: db["Student"],
              attributes: ["StudentName"],
            },
          },
        },
      },
      order: [
        ["StageId", "ASC"],
        [db["Grade"], "GradeId", "ASC"],
        [db["Grade"], db["Class"], "ClassId", "ASC"],
        [
          db["Grade"],
          db["Class"],
          db["StudentClass"],
          db["Student"],
          "StudentId",
          "ASC",
        ],
      ],
    })
    .then(mapToJSON);
};
// eslint-disable-next-line no-unused-vars
const getStudentsByColumnMultipleVals = (column, vals) => {
  // console.log(vals);
  return db["Student"]
    .findAll({
      where: {
        [column]: {
          [Op.in]: vals,
        },
      },
    })
    .then(mapToJSON);
};

// eslint-disable-next-line no-unused-vars
const addNewStudent = async (
  fatherData,
  motherData,
  responsibleParentData,
  studentData,
  ClassId,
) => {
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
    // check if there is a mother
    if (motherData) {
      let mother = await parent.addParent(motherData, t);
      StudentMotherId = mother.ParentId;
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
      StudentResponsibleRelation,
    };
    // create student
    let student = await db["Student"].create(studentData, { transaction: t }).catch(err => {
      console.log("");
    });
    student = student.dataValues;
    let StudentId = student.StudentId;
    // add class info
    await db["StudentClass"].create(
      {
        StudentId,
        ClassId,
      },
      { transaction: t },
    );
    return student;
  });
};

//update student by studentId
const updateStudentByStudentId = async (
  StudentId,
  newFatherData,
  newMotherData,
  newResponsibleParentData,
  newStudentData,
  newClassId,
) => {
  return await db.sequelize.transaction(async (t) => {
    // get StudentFatherId , StudentMotherId , StudentResponsibleId
    let { StudentFatherId, StudentMotherId, StudentResponsibleId } = await db[
      "Student"
    ].findOne(
      {
        attributes: [
          "StudentFatherId",
          "StudentMotherId",
          "StudentResponsibleId",
        ],
        where: {
          StudentId: StudentId,
        },
      },
      { transaction: t },
    );
    // check if ther ia new father data if  so update it
    if (newFatherData) {
      // check if the student has a father
      if (!StudentFatherId) {
        // create new parent with the data
        let father = await parent.addParent(newFatherData, t);
        StudentFatherId = father.toJSON().ParentId;
      } else {
        // update father with the new data
        await parent.updateParentById(StudentFatherId, newFatherData, t);
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
        await db["Student"].update(
          {
            StudentMotherId,
          },
          {
            where: {
              StudentId,
            },
            transaction: t,
          },
        );
      } else {
        // update mother with the new data
        await parent.updateParentById(StudentMotherId, newMotherData, t);
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
        await parent.updateParentById(
          StudentResponsibleId,
          newResponsibleParentData[1],
          t,
        );
        StudentResponsibleRelation = newResponsibleParentData[0];
      }
    }
    // update new student data
    newStudentData = {
      ...newStudentData,
      StudentFatherId,
      StudentMotherId,
      StudentResponsibleId,
      StudentResponsibleRelation,
    };
    await db["Student"].update(newStudentData, {
      where: {
        StudentId,
      },
      transaction: t,
    });
    // if there is new classId update it
    if (newClassId) {
      await db["StudentClass"].update(
        {
          ClassId: newClassId,
        },
        {
          where: {
            StudentId,
          },
          transaction: t,
        },
      );
    }
  });
};
const upgradeStudentsToNextGrade = async () => {
  return await db.sequelize.transaction(async (t) => {
    let Stages = await db["Stage"].findAll({
      attributes: ["StageId"],
    });
    Stages = Stages.map((s) => s.dataValues.StageId)
      .sort()
      .reverse();
    for (let i = 0; i < Stages.length; i++) {
      const StageId = Stages[i];
      let Grades = await db["Grade"].findAll({
        attributes: ["GradeId"],
        where: {
          StageId,
        },
      });
      Grades = Grades.map((g) => g.dataValues.GradeId)
        .sort()
        .reverse();
      for (let j = 0; j < Grades.length; j++) {
        const GradeId = Grades[j];
        let nextGradeId = Grades[j - 1];
        if (!nextGradeId) {
          let nextStageId = Stages[i - 1];
          if (!nextStageId) {
            // graduate last classes
            await db["Class"].destroy({
              where: {
                GradeId,
              },
              transaction: t,
            });
            // update exit date
            continue;
          }
          let GradesOfNextStage = await db["Grade"].findAll({
            attributes: ["GradeId"],
            where: {
              StageId: nextStageId,
            },
          });
          nextGradeId = GradesOfNextStage.map(
            (g) => g.dataValues.GradeId,
          ).sort()[0];
        }
        // update all classes with new grade Id
        await db["Class"].update(
          {
            GradeId: nextGradeId,
          },
          {
            where: {
              GradeId,
            },
            transaction: t,
          },
        );
      }
    }
    // adde new 2 classes at first grade
    let firstStageId = Stages[Stages.length - 1];
    let Grades = await db["Grade"].findAll({
      attributes: ["GradeId"],
      where: {
        StageId: firstStageId,
      },
    });
    Grades = Grades.map((g) => g.dataValues.GradeId).sort();
    if (Grades.length !== 0) {
      let firstGradeId = Grades[0];
      await db["Class"].bulkCreate(
        [{ GradeId: firstGradeId }, { GradeId: firstGradeId }],
        { transaction: t },
      );
    }
    return "Students have been upgraded";
  });
};
const transferStudent = (StudentId, SchoolName, SchoolType, TransferType) => {
  return db.sequelize.transaction((t) => {
    // delete student from student class
    let proms = [];
    let currentDate = new Date();
    proms.push(
      db["StudentClass"].destroy({
        where: {
          StudentId,
        },
        transaction: t,
      }),
    );
    // destroy studentApsent
    proms.push(db["StudentAbsent"].destroy({
      where: {
        StudentId
      },
      transaction: t
    }));
    // destroy from studentBusRoute 
    proms.push(db["StudentBusRoute"].destroy({
      where: {
        StudentId
      },
      transaction: t
    }));
    // studentSeat
    proms.push(db["StudentSeat"].destroy({
      where: {
        StudentId
      },
      transaction: t
    }));
    // studentDiscount
    proms.push(db["StudentDiscount"].destroy({
      where: {
        StudentId
      },
      transaction: t
    }));
    // student warning 
    proms.push(db["StudentWarning"].destroy({
      where: {
        StudentId
      },
      transaction: t
    }));

    proms.push(
      db["TransferredStudent"].create(
        {
          StudentId,
          SchoolName,
          SchoolType,
          TransferType,
          TransferDate: currentDate.toISOString(),
        },
        {
          transaction: t,
        },
      ),
    );
    return Promise.all(proms);
  });
};
// get financial Data
const getFinancialData = async (StudentId) => {
  let proms = [];
  //get current academic year
  let CurrentAcademicYear = await db["GlobalValues"]
    .findOne({
      where: {
        GlobalName: "AcademicYear",
      },
    })
    .then((res) => res.toJSON().GlobalValue);
  let firstYear = CurrentAcademicYear.split("/")[0];
  let secondYear = CurrentAcademicYear.split("/")[1];
  let firstInstallmentDueDate = new Date(
    new Date().setFullYear(Number(firstYear), 11, 31),
  ).toISOString();
  let secondInstallmentDueDate = new Date(
    new Date().setFullYear(Number(secondYear), 7, 31),
  ).toISOString();
  // get first installment Data
  proms.push(
    db["Installment"]
      .findOne({
        where: {
          StudentId,
          InstallmentName: "first-install",
          InstallmentType: "Category",
          InstallmentDueDate: firstInstallmentDueDate,
        },
      })
      .then((inst) => {
        if (inst) {
          return inst.toJSON();
        } else {
          return {};
        }
      }),
  );
  // get second installment Data
  proms.push(
    db["Installment"]
      .findOne({
        where: {
          StudentId,
          InstallmentName: "second-install",
          InstallmentType: "Category",
          InstallmentDueDate: secondInstallmentDueDate,
        },
      })
      .then((inst) => {
        if (inst) {
          return inst.toJSON();
        } else {
          return {};
        }
      }),
  );
  // get all installments that FROMLASTYEARED
  proms.push(
    db["Installment"]
      .findAll({
        where: {
          StudentId,
          Status: "FROMLASTYEAR",
          InstallmentFullyPaidDate: null,
        },
      })
      .then((insts) => {
        if (insts) {
          return mapToJSON(insts);
        } else {
          return [];
        }
      }),
  );

  // get all cats that students have to pay
  proms.push(
    (async () => {
      let p = [];
      p.push(
        db["Category"]
          .findAll({
            where: {
              AcademicYear: CurrentAcademicYear,
            },
            include: {
              model: db["Grade"],
              attributes: ["GradeId"],
              required: true,
              include: {
                model: db["Class"],
                required: true,
                include: {
                  model: db["StudentClass"],
                  required: true,
                  include: {
                    model: db["Student"],
                    required: true,
                    where: {
                      StudentId,
                    },
                  },
                },
              },
            },
          })
          .then(mapToJSON),
      );
      p.push(
        db["PaymentCategory"]
          .findAll({
            include: {
              model: db["Payment"],
              where: {
                StudentId,
              },
              required: true,
            },
          })
          .then(mapToJSON),
      );

      const [allCats, paidCats] = await Promise.all(p);
      let finalCats = [];
      for (let i = 0; i < allCats.length; i++) {
        const cat = allCats[i];
        let found = false;
        for (let j = 0; j < paidCats.length; j++) {
          const paidCat = paidCats[j];
          if (cat.CategoryId === paidCat.CategoryId) {
            let catIndex = finalCats.findIndex(
              (el) => el.CategoryId === cat.CategoryId,
            );
            if (catIndex === -1) {
              finalCats.push({
                CategoryId: cat.CategoryId,
                CategoryName: cat.CategoryName,
                CategoryCost: cat.CategoryCost,
                AcademicYear: cat.AcademicYear,
                paidAmount: paidCat.Amount,
              });
            } else {
              finalCats[catIndex].paidAmount += paidCat.Amount;
            }
            found = true;
          }
        }
        if (!found) {
          finalCats.push({
            CategoryId: cat.CategoryId,
            CategoryName: cat.CategoryName,
            CategoryCost: cat.CategoryCost,
            AcademicYear: cat.AcademicYear,
            paidAmount: 0,
          });
        }
      }
      return finalCats;
    })(),
  );
  let [firsInstall, secondInstall, fromLastYearInstall, Categories] =
    await Promise.all(proms);
  // get bus data
  // let BusData = {};
  // check if the student is subscribed
  let BusData = await db["StudentBusRoute"].findOne({
    where: {
      StudentId: StudentId
    }
  }).then((res) => {
    if (res) {
      let data = res.toJSON();
      return {
        isSubscribed: true,
        data
      };
    } else {
      return {
        isSubscribed: false,
        data: {}
      };
    }
  });
  // get bus Route
  if (BusData.isSubscribed) {
    let busRoute = await db["BusRoute"].findOne({
      where: {
        BusRouteId: BusData.data.BusRouteId
      }
    }).then(res => res.toJSON());
    BusData.data["BusRoute"] = busRoute;
    // get fist installment 
    let firstBusInstallment = await instal.getCurrentFirstBusInstallment(StudentId);
    let secondBusInstallment = await instal.getCurrentSecondBusInstallment(StudentId);
    BusData.data["firstInstalllment"] = firstBusInstallment;
    BusData.data["secondInstallment"] = secondBusInstallment;
  }
  // get all Routes 
  let BusRoutes = await Bus.getBusRoutes();
  BusData.data["BusRoutes"] = BusRoutes;
  return { firsInstall, secondInstall, fromLastYearInstall, Categories, BusData };
};
module.exports = {
  getAllStudents,
  addNewStudent,
  updateStudentByStudentId,
  upgradeStudentsToNextGrade,
  getStudentsByColumnMultipleVals,
  getStudentData,
  getFinancialData,
  transferStudent,
};
