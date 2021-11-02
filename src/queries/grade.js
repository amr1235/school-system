const db = require("../db/models/index");

//get all grades
const getGrades = () => {
  return db["Grade"]
    .findAll({
      attributes: ["GradeId", "GradeName", "StageId"],
      order: [
        ["GradeId", "ASC"],
        ["StageId", "ASC"],
      ],
    })
    .then((grades) =>
        grades.map((grade) => [
          grade.dataValues.GradeId,
          grade.dataValues.GradeName,
          grade.dataValues.StageId,
        ]) );
  //output [[GradeId,GradeName,StageId],[GradeId,GradeName,StageId],....]
};
// add grade
const addGrade = (GradeName, StageId) => {
  return db["Grade"].create({
    GradeName,
    StageId,
  });
};

//update grade
const updateGrade = (GradeId, data) => {
  return db["Grade"].update(data, {
    where: {
      GradeId,
    },
  });
};
// delete grade
const deleteGrade = (GradeId) => {
  return db["Grade"].destory({
    where: {
      GradeId,
    },
  });
};

module.exports = {
  getGrades,
  addGrade,
  updateGrade,
  deleteGrade,
};
