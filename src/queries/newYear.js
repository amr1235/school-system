const db = require("../db/models/index");
const { Op } = require("sequelize");
const { mapToJSON, incrementAcademicYear } = require("../queries/utlis");
const { upgradeStudentsToNextGrade } = require("../queries/students")
const StartNewYear = (allExpensesData) => {
    // loop throw each gradeExpenses 
    // add all cats for the grade using current academic year
    // add new 2 installments to all student in that grade using gradeExpenses Data
    return db.sequelize.transaction(async (t) => {
        // update unpaid installments 
        await db["Installment"].update({
            Status: 'FROMLASTYEAR'
        }, {
            where: {
                Status: 'DUE',
                InstallmentFullyPaidDate: {
                    [Op.is]: null
                }
            },
            transaction: t
        });
        // transfer all students
        await upgradeStudentsToNextGrade()
        //get current academic year
        let CurrentAcademicYear = await db["GlobalValues"].findOne({
            where: {
                GlobalName: "AcademicYear"
            }
        }).then(res => res.toJSON().GlobalValue);
        // increment academicYear 
        let NextAcademicYear = incrementAcademicYear(CurrentAcademicYear);
        let proms = [];
        //add new academicyear
        proms.push(db["GlobalValues"].update({
            GlobalValue: NextAcademicYear
        }, {
            where: {
                GlobalName: "AcademicYear"
            },
            transaction: t
        }));
        // loop throw expenses 
        allExpensesData.forEach(async (expense) => {
            // add new categories with new academic year
            expense.Categories.forEach(cat => {
                proms.push(db["Category"].create({
                    GradeId: expense.GradeId,
                    CategoryName: cat.CategoryName,
                    CategoryCost: cat.CategoryCost,
                    AcademicYear: NextAcademicYear
                }, {
                    transaction: t
                }));
            });
            // calculate installments cost
            let firstInstallmentCost = Math.round((expense.firstInstallmentPortion / 100) * expense.totalCost);
            let secondInstallmentCost = expense.totalCost - firstInstallmentCost;
            // get all studentsId in the grade 
            let StudentIds = await db["Class"].findAll({
                where: {
                    GradeId: expense.GradeId
                },
                include: {
                    model: db["StudentClass"],
                    attributes: ['StudentId'],
                    required: true,
                }
            }).then(res => {
                let classes = mapToJSON(res);
                let ids = [];
                classes.forEach(cls => {
                    cls.StudentClasses.forEach(std => {
                        ids.push(std.StudentId)
                    });
                });
                return ids
            });
            let firstYear = NextAcademicYear.split("/")[0];
            let secondYear = NextAcademicYear.split("/")[1];
            StudentIds.forEach(StudentId => {
                let installments = [
                    {
                        StudentId,
                        InstallmentName: 'first-install',
                        InstallmentAmount: firstInstallmentCost,
                        InstallmentDueDate: (new Date((new Date()).setFullYear(Number(firstYear), "11", "31"))).toISOString(),
                        InstallmentFullyPaidDate: null,
                        InstallmentType: 'Category'
                    }, {
                        StudentId,
                        InstallmentName: 'second-install',
                        InstallmentAmount: secondInstallmentCost,
                        InstallmentDueDate: (new Date((new Date()).setFullYear(Number(secondYear), "7", "31"))).toISOString(),
                        InstallmentFullyPaidDate: null,
                        InstallmentType: 'Category'
                    }
                ];
                proms.push(db["Installment"].bulkCreate(installments, {
                    transaction: t
                }));
            });
            // delete bus subs 
            proms.push(db["BusRoute"].destory());
        });
        return Promise.all(proms);
    });
};

module.exports = {
    StartNewYear
};