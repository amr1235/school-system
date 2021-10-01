const db = require("../db/models/index");
// const { Op } = require("sequelize");
const { mapToJSON } = require("./utlis");

const getCurrentFirstInstallment = async (StudentId) => {
    let CurrentAcademicYear = await db["GlobalValues"].findOne({
        where: {
            GlobalName: "AcademicYear"
        }
    }).then(res => res.toJSON().GlobalValue);
    let firstYear = CurrentAcademicYear.split("/")[0];
    let firstInstallmentDueDate = (new Date((new Date()).setFullYear(Number(firstYear), 11, 31))).toISOString()
    // get first installment Data
    return db["Installment"].findOne({
        where: {
            StudentId,
            InstallmentName: 'first-install',
            InstallmentType: 'Category',
            InstallmentDueDate: firstInstallmentDueDate
        }
    }).then(inst => {
        if (inst) {
            return inst.toJSON();
        } else {
            return {};
        }
    });
};

const getCurrentSecondInstallment = async (StudentId) => {
    let CurrentAcademicYear = await db["GlobalValues"].findOne({
        where: {
            GlobalName: "AcademicYear"
        }
    }).then(res => res.toJSON().GlobalValue);
    let secondYear = CurrentAcademicYear.split("/")[1];
    let secondInstallmentDueDate = (new Date((new Date()).setFullYear(Number(secondYear), 7, 31))).toISOString()
    // get second installment Data 
    return db["Installment"].findOne({
        where: {
            StudentId,
            InstallmentName: 'second-install',
            InstallmentType: 'Category',
            InstallmentDueDate: secondInstallmentDueDate
        }
    }).then(inst => {
        if (inst) {
            return inst.toJSON();
        } else {
            return {};
        }
    });
};

const PayFromLastYearInstallment = (InstallmentId, newAmount) => {
    // get installment 
    return db.sequelize.transaction(async (t) => {
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
            }, {
                where: {
                    InstallmentId
                },
                transaction: t
            });
            await db["Installment"].increment('InstallmentPaidAmount', {
                by: Number(newAmount),
                where: {
                    InstallmentId
                },
                transaction: t
            });
        } else {
            await db["Installment"].increment('InstallmentPaidAmount', {
                by: Number(newAmount),
                where: {
                    InstallmentId
                },
                transaction: t
            });
        }
    });
};
module.exports = {
    getCurrentFirstInstallment,
    getCurrentSecondInstallment,
    PayFromLastYearInstallment
};