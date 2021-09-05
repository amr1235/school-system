const db = require("../db/models/index");
const { Op } = require("sequelize");

// add new parent function
const addParent = async (parentData) => {
  return db.sequelize.transaction(async (t) => {

    // check if the parent already exists
    let parentSSn = parentData.ParentNationalId ? parentData.ParentNationalId : parentData.ParentPassportId;
    let parent = await db["Parent"].findOne({
      where: {
        [Op.or]: [
          { ParentNationalId: parentSSn },
          { ParentPassportId: parentSSn }
        ]
      }
    });
  
    if (!parent) {
      parent = await db["Parent"].create(parentData, { transaction: t });
  
      // add parent phones
      if (parentData.phones.length != 0) {

        // createParentPhone is automatically created by sequelize
        // when we specify associations in the model
        await Promise.all(parentData.phones.map(async (phone) => {
          return parent.createParentPhone({
            ParentPhoneNumber: phone
          }, { transaction: t }).then(res=>res.toJSON().ParentPhoneNumber);
        }));

      } else {
        throw new Error("Must specify at least one phone!");
      }
    
      // add parent job
      if (parentData.ParentJobId) {
        parent.createParentJob({
          ParentJobId: parentData.ParentJobId,
          ParentJobAddress: parentData.ParentJobAddress
        }, { transaction: t });
      }
    } else {
      throw new Error(`Parent with NationalId ${parent.toJSON().ParentNationalId} already exists!`);
    }
    return parent;
  });
};

module.exports = {
  addParent
};