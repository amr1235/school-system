const db = require("../db/models/index");

//get all stages
const getStages = () => {
  return new Promise((res,rej) => {
    db["Stage"].findAll({
      attributes : ["StageName","StageId"]
    }).then(stages => res(stages.map(stage => [stage.dataValues.StageName,stage.dataValues.StageId]))).catch(err => rej(err));
  });
  // output [ [stageName,StageId] , [StageName,StageId] , ....]
};
// add stage 
const addStage = (StageName) => {
  return db["Stage"].create({
    StageName
  });
};

// update stage 
const updateStage = (StageId,data) => {
  return db["Stage"].update(data,{
    where : {
      StageId
    }
  });
};

// delete stage
const deleteStage = (StageId) => {
  return db["Stage"].destroy({
    where : {
      StageId
    }
  });
};

module.exports = {
  getStages,
  addStage,
  updateStage,
  deleteStage
};