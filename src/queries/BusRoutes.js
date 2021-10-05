const db = require("../db/models/index");
const { mapToJSON } = require("./utlis");
const installment = require("../queries/installment");

const getBusRoutes = () => {
    return db["BusRoute"].findAll().then(mapToJSON);
};
const unSubscribeBusRoute = (StudentId, unSubscribeFees) => {
    return db.sequelize.transaction(async (t) => {
        let currentDate = new Date();
        let PaymentDate = currentDate.toISOString();
        let proms = [];
        //delete student from StudentBusRoute table
        proms.push(db["StudentBusRoute"].destroy({
            where: {
                StudentId
            },
            transaction: t
        }));
        if (unSubscribeFees > 0) {
            // add payment with unsubscribe fees
            proms.push(db["Payment"].create({
                StudentId,
                PaymentType: 'Bus',
                PaymentAmount: unSubscribeFees,
                PaymentDate
            }, { transaction: t }));
        }
        // delete prev installments if there is no amount paid
        const firstInstallment = await installment.getCurrentFirstBusInstallment(
            StudentId,
        );
        const secondInstallment = await installment.getCurrentSecondBusInstallment(
            StudentId,
        );
        if (firstInstallment.InstallmentPaidAmount === 0) {
            proms.push(db["Installment"].destroy({
                where: {
                    InstallmentId: firstInstallment.InstallmentId
                },
                transaction: t
            }));
        } else {
            // make it paid
            proms.push(db["Installment"].update({
                Status: "PAID",
                InstallmentFullyPaidDate: PaymentDate,
            }, {
                where: {
                    InstallmentId: firstInstallment.InstallmentId
                },
                transaction: t
            }));
        }
        if (secondInstallment.InstallmentPaidAmount === 0) {
            proms.push(db["Installment"].destroy({
                where: {
                    InstallmentId: secondInstallment.InstallmentId
                },
                transaction: t
            }));
        } else {
            // make it paid
            proms.push(db["Installment"].update({
                Status: "PAID",
                InstallmentFullyPaidDate: PaymentDate,
            }, {
                where: {
                    InstallmentId: secondInstallment.InstallmentId
                },
                transaction: t
            }));
        }
        return Promise.all(proms);
    });
};
const subscribeToNewBusRoute = (StudentId, BusRouteId, BusCost, firstBusInstallmentPortion, IsFullRoute) => {
    return db.sequelize.transaction(async (t) => {
        // add the student to student-bus-route table 
        let proms = [];
        proms.push(db["StudentBusRoute"].create({
            StudentId,
            BusRouteId,
            IsFullRoute
        }, {
            transaction: t
        }));
        // create 2 installments 
        let firstInstallmentCost = Math.round((firstBusInstallmentPortion / 100) * BusCost);
        let secondInstallmentCost = BusCost - firstInstallmentCost;
        let CurrentAcademicYear = await db["GlobalValues"].findOne({
            where: {
                GlobalName: "AcademicYear"
            }
        }).then(res => res.toJSON().GlobalValue);
        let firstYear = CurrentAcademicYear.split("/")[0];
        let secondYear = CurrentAcademicYear.split("/")[1];
        let installments = [
            {
                StudentId,
                InstallmentName: 'first-install',
                InstallmentAmount: firstInstallmentCost,
                InstallmentDueDate: (new Date((new Date()).setFullYear(Number(firstYear), "11", "31"))).toISOString(),
                InstallmentFullyPaidDate: null,
                InstallmentType: 'Bus'
            }, {
                StudentId,
                InstallmentName: 'second-install',
                InstallmentAmount: secondInstallmentCost,
                InstallmentDueDate: (new Date((new Date()).setFullYear(Number(secondYear), "7", "31"))).toISOString(),
                InstallmentFullyPaidDate: null,
                InstallmentType: 'Bus'
            }
        ];
        proms.push(db["Installment"].bulkCreate(installments, {
            transaction: t
        }));
        return Promise.all(proms);
    });
}
const updateBusRoutes = (newRoutes, deletedRoutes, goingToUpdateroutes) => {
    return db.sequelize.transaction((t) => {
        // add new ones
        let proms = [];
        proms.push(db["BusRoute"].bulkCreate(newRoutes, { transaction: t }));
        // delete
        deletedRoutes.forEach(route => {
            proms.push(db["BusRoute"].destroy({
                where: {
                    BusRouteId: route.BusRouteId
                }
            }));
        });
        // update 
        goingToUpdateroutes.forEach(route => {
            proms.push(db["BusRoute"].update(route.newData, {
                where: {
                    BusRouteId: route.BusRouteId
                }
            }))
        });
        return Promise.all(proms);
    });
};
module.exports = {
    getBusRoutes,
    updateBusRoutes,
    subscribeToNewBusRoute,
    unSubscribeBusRoute
};