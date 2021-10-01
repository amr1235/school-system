const db = require("../db/models/index");
// const { Op } = require("sequelize");
const { mapToJSON } = require("./utlis");

const addNewExpenses = (totalCost, GradeId, firstInstallmentPortion, Categories) => {
    return db.sequelize.transaction(async (t) => {
        // add all cats to 
        
    });
}