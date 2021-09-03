const db = require("../db/models/index");

// get all classes 
const getClasses = () => {
  return new Promise((res,rej) => {
    db["Class"].findAll({
      attributes : ["ClassId","GradeId"]
    }).then(classes => res(classes.map(clas => [clas.dataValues.ClassId,clas.dataValues.GradeId])))
      .catch(err => rej(err));
  });
  //output [[ClassId,GradeId],[ClassId,GradeId],....]
};
// add class 
const addClass = (GradeId) => {
  return db["Class"].create({
    GradeId
  });
};

// update class 
const updateClass = (ClassId,data) => {
  return db["Class"].update(data,{
    where : {
      ClassId
    }
  });
};
// delete class
const deleteClass = (ClassId) => {
  return db["Class"].destroy({
    where : {
      ClassId
    }
  });
};

module.exports = {
  getClasses,
  addClass,
  updateClass,
  deleteClass
};