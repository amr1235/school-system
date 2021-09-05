const db = require("../db/models/index");
const { Op } = require("sequelize");

// add new parent function
const addParent = async (parentData,transaction) => {

  // check if the parent already exist
  let parentSSn = parentData.ParentNationalId ? parentData.ParentNationalId : parentData.ParentPassportId;
  let parent = await db["Parent"].findAll({
    where: {
      [Op.or]: [
        { ParentNationalId: parentSSn },
        { ParentPassportId: parentSSn }
      ]
    }
  },{transaction});
  parent = parent[0];
  // !mother ? add new parent : return the existing parent
  if (!parent) {
    parent = await db["Parent"].create(parentData,{transaction});
    // add prent phones
    let phones = parentData.phones;
    if (parentData.phones.length != 0) {
      for (let i = 0; i < phones.length; i++) {
        const phone = phones[i];
        await db["ParentPhone"].create({
          ParentId: parent.ParentId,
          ParentPhoneNumber: phone
        },{transaction});
      }
    } else {
      throw Error("no phones !");
    }
    if (parentData.ParentJobId) {
      // add parent job
      await db["ParentJob"].create({
        ParentId: parent.ParentId,
        ParentJobId: parentData.ParentJobId,
        ParentJobAddress: parentData.ParentJobAddress
      },{transaction});
    }
    else {
      throw Error("no jobs !");
    }
  }
  parent = parent.dataValues;
  return parent;
};

module.exports = {
  addParent
};