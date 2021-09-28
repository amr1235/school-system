const db = require("../db/models/index");
// const { Op } = require("sequelize");
const { mapToJSON } = require("./utlis");

const getCurrentFirstInstallment = (StudentId) => {
    return db["Installment"].findOne({
        where: {
            InstallmentName: 'first-install',
            Status: 'DUE',
            StudentId
        }
    }).then(res => res.toJSON());
};

const getCurrentSecondInstallment = (StudentId) => {
    return db["Installment"].findOne({
        where: {
            InstallmentName: 'second-install',
            Status: 'DUE',
            StudentId
        }
    }).then(res => res.toJSON());
};

const PayFromLastYearInstallment = (InstallmentId, newAmount) => {
    // get installment 
    return db.sequelize.transaction(async(t) => {
        let currentDate = new Date();
        currentDate = currentDate.toISOString();
        let install = await db["Installment"].findOne({
            where: {
                InstallmentId
            }
        }).then(res => res.toJSON());
        if (Number(newAmount) === (install.InstallmentAmount - install.InstallmentPaidAmount)) {
            console.log("here");
            await db["Installment"].update({
                InstallmentFullyPaidDate: currentDate
            },{
                where : {
                    InstallmentId
                },
                transaction : t
            });
            await db["Installment"].increment('InstallmentPaidAmount', {
                by: Number(newAmount),
                where: {
                    InstallmentId
                },
                transaction : t
            });
        }else {
            await db["Installment"].increment('InstallmentPaidAmount', {
                by: Number(newAmount),
                where: {
                    InstallmentId
                },
                transaction : t
            });
        }
    });
};
module.exports = {
    getCurrentFirstInstallment,
    getCurrentSecondInstallment,
    PayFromLastYearInstallment
};