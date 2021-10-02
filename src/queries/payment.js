const db = require("../db/models/index");
const installment = require("../queries/installment");
// const { Op } = require("sequelize");
const { mapToJSON } = require("./utlis");

const addCategoryPaymentAndUpdateInstallments = (CatsMoney, StudentId) => {
  return db.sequelize.transaction(async (t) => {
    let currentDate = new Date();
    let PaymentDate = currentDate.toISOString();
    // first add payment with the total amount to the student
    // calculate totale amout
    let totalAmount = 0;
    CatsMoney.forEach((cat) => {
      totalAmount += cat.amount;
    });
    let Payment = await db["Payment"]
      .create(
        {
          StudentId,
          PaymentType: "Category",
          PaymentAmount: totalAmount,
          PaymentDate,
        },
        {
          transaction: t,
        },
      )
      .then((res) => res.toJSON());
    let PaymentId = Payment.PaymentId;
    // add each cat to studentcategory table
    let proms = [];
    CatsMoney.forEach((cat) => {
      proms.push(
        db["PaymentCategory"].create(
          {
            CategoryId: Number(cat.CategoryId),
            PaymentId,
            Amount: cat.amount,
          },
          {
            transaction: t,
          },
        ),
      );
    });
    // update installments
    // get first,second installment
    const firstInstallment = await installment.getCurrentFirstInstallment(
      StudentId,
    );
    const secondInstallment = await installment.getCurrentSecondInstallment(
      StudentId,
    );
    // we have 2 seario
    if (
      totalAmount ===
      firstInstallment.InstallmentAmount -
        firstInstallment.InstallmentPaidAmount
    ) {
      // 1-> totalAmount == first installmentRemainingAmount
      // update first installment paid amount
      let newAmount = firstInstallment.InstallmentPaidAmount + totalAmount;
      proms.push(
        db["Installment"].update(
          {
            InstallmentPaidAmount: newAmount,
            Status: "PAID",
            InstallmentFullyPaidDate: PaymentDate,
          },
          {
            where: {
              InstallmentId: firstInstallment.InstallmentId,
            },
            transaction: t,
          },
        ),
      );
    } else if (
      totalAmount <
      firstInstallment.InstallmentAmount -
        firstInstallment.InstallmentPaidAmount
    ) {
      let newAmount = firstInstallment.InstallmentPaidAmount + totalAmount;
      proms.push(
        db["Installment"].update(
          {
            InstallmentPaidAmount: newAmount,
          },
          {
            where: {
              InstallmentId: firstInstallment.InstallmentId,
            },
            transaction: t,
          },
        ),
      );
    } else {
      // 2-> totalAmount > first installmentRemainingAmount
      // check if the first installment not complete if so complete it first
      let amountPaidForFirstInstallment = 0;
      if (
        firstInstallment.InstallmentAmount -
          firstInstallment.InstallmentPaidAmount !==
        0
      ) {
        let newAmount =
          firstInstallment.InstallmentAmount -
          firstInstallment.InstallmentPaidAmount;
        proms.push(
          db["Installment"].update(
            {
              InstallmentPaidAmount: firstInstallment.InstallmentAmount,
              Status: "PAID",
              InstallmentFullyPaidDate: PaymentDate,
            },
            {
              where: {
                InstallmentId: firstInstallment.InstallmentId,
              },
              transaction: t,
            },
          ),
        );
        amountPaidForFirstInstallment = newAmount;
      }
      // update the remaining to the second installment
      let newAmount = totalAmount - amountPaidForFirstInstallment;
      if (
        newAmount ===
        secondInstallment.InstallmentAmount -
          secondInstallment.InstallmentPaidAmount
      ) {
        proms.push(
          db["Installment"].update(
            {
              InstallmentPaidAmount: secondInstallment.InstallmentAmount,
              Status: "PAID",
              InstallmentFullyPaidDate: PaymentDate,
            },
            {
              where: {
                InstallmentId: secondInstallment.InstallmentId,
              },
              transaction: t,
            },
          ),
        );
      } else {
        newAmount += secondInstallment.InstallmentPaidAmount;
        proms.push(
          db["Installment"].update(
            {
              InstallmentPaidAmount: newAmount,
            },
            {
              where: {
                InstallmentId: secondInstallment.InstallmentId,
              },
              transaction: t,
            },
          ),
        );
      }
    }
    return Promise.all(proms);
  });
};

module.exports = {
  addCategoryPaymentAndUpdateInstallments,
};
