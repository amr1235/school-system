const db = require("../db/models/index");
const { Op } = require("sequelize");
const { mapToJSON } = require("./utlis");

// update parent by Id
const updateParentById = async (ParentId, newParentData, t) => {
  let parentData = newParentData.ParentData;
  // update phones 
  // delete all phones 
  // add new phones 
  await db["ParentPhone"].destroy({
    where: {
      ParentId
    },
    transaction: t
  });
  newParentData.phones.forEach(async (phone) => {
    await db["ParentPhone"].create({
      ParentId,
      ParentPhoneNumber: phone
    }, { transaction: t });
  });
  // update jobs 
  // delete all jobs 
  // add new jobs
  await db["ParentJob"].destroy({
    where: {
      ParentId
    },
    transaction: t
  });
  newParentData.jobs.forEach(async (job) => {
    await db["ParentJob"].create({
      ParentId,
      ParentJobId: job.ParentJobId,
      ParentJobAddress: job.ParentJobAddress
    }, {
      transaction: t
    });
  });
  // updade parent 
  await db["Parent"].update(parentData, {
    where: {
      ParentId
    },
    transaction: t
  });

};
//get ParentById 
const getParentById = async (ParentId) => {
  //get parent data 
  let parentData = await db["Parent"].findOne({
    where: {
      ParentId
    }
  });
  parentData = parentData.dataValues;
  //get parent phones 
  let parentPhones = await db["ParentPhone"].findAll({
    attributes: ["ParentPhoneNumber"],
    where: {
      ParentId
    }
  });
  parentPhones = mapToJSON(parentPhones).map(el => el.ParentPhoneNumber);
  let parentJobs = await db["Job"].findAll({
    attributes: ["JobName"],
    include: {
      model: db["ParentJob"],
      attributes: ["ParentJobId", "ParentJobAddress"],
      where: {
        ParentId
      }
    }
  });
  parentJobs = mapToJSON(parentJobs).map(el => {
    return { JobName: el.JobName, JobId: el.ParentJobs[0].ParentJobId, JobAddress: el.ParentJobs[0].ParentJobAddress };
  });
  return {
    ...parentData,
    phones: parentPhones,
    jobs: parentJobs
  };
};
// add new parent function
const addParent = async (parentData,t) => {
  // check if the parent already exists
  let parentSSn = parentData.ParentData.ParentNationalId ? parentData.ParentData.ParentNationalId : parentData.ParentData.ParentPassportId;
  let parent = await db["Parent"].findOne({
    where: {
      [Op.or]: [
        { ParentNationalId: parentSSn },
        { ParentPassportId: parentSSn }
      ]
    }
  });

  if (!parent) {
    parent = await db["Parent"].create(parentData.ParentData, { transaction: t });

    // add parent phones
    if (parentData.phones.length != 0) {

      // createParentPhone is automatically created by sequelize
      // when we specify associations in the model
      await Promise.all(parentData.phones.map(async (phone) => {
        return parent.createParentPhone({
          ParentPhoneNumber: phone
        }, { transaction: t }).then(res => res.toJSON().ParentPhoneNumber);
      }));

    } else {
      throw new Error("Must specify at least one phone!");
    }

    // add parent job
    parentData.jobs.forEach(async (job) => {
      await parent.createParentJob({
        ParentJobId: job.ParentJobId,
        ParentJobAddress: job.ParentJobAddress
      }, { transaction: t });
    });
  } else {
    throw new Error(`Parent with NationalId ${parent.toJSON().ParentNationalId} already exists!`);
  }
  return parent;
};
// add new job 
const addNewJob = (JobName) => {
  return db["Job"].create({JobName});
};
module.exports = {
  addParent,
  getParentById,
  updateParentById,
  addNewJob
};