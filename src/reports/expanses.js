const db = require("../db/models");
const { Op } = require("sequelize");

exports.getDailyReport = async (date) => {
  if (!date) {
    date = new Date().toISOString().split("T")[0];
  }
  return db["Payment"]
    .findAll({
      where: {
        PaymentDate: date,
      },
      include: {
        model: db["Student"],
        required: true,
        attributes: ["StudentName"],
        include: {
          model: db["StudentClass"],
          required: true,
          attributes: ["ClassId"],
          include: {
            model: db["Class"],
            required: true,
            attributes: ["ClassId"],
            include: {
              model: db["Grade"],
              required: true,
              attributes: ["GradeName"],
            },
          },
        },
      },
    })
    .then((payments) =>
      payments.map((payment) => {
        const pay = payment.toJSON();
        return [
          pay["Student"]["StudentName"],
          pay["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          pay["PaymentType"] === "Bus" ? "باص" : "خدمات",
          pay["PaymentAmount"],
          pay["PaymentDate"],
        ];
      }),
    )
    .then((payments) => {
      const total = payments.reduce((sum, payment) => (sum += payment[3]), 0);
      payments.push(["المجموع", "", "", total, ""]);
      console.log(payments);
      return payments;
    })
    .catch(console.err);
};

exports.getMonthlyReport = async (date) => {
  let startDate;
  let endDate;
  if (!date) {
    date = new Date();
    // eslint-disable-next-line no-unused-vars
    let [year, month, _] = date.toISOString().split("-");
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    endDate = new Date(year, month, 1);
    startDate = new Date(year, month - 1, 2);
  } else {
    let [year, month] = date.split("-");
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    endDate = new Date(year, month, 1);
    startDate = new Date(year, month - 1, 2);
  }
  startDate = startDate.toISOString().split("T")[0];
  endDate = endDate.toISOString().split("T")[0];
  return db["Payment"]
    .findAll({
      where: {
        PaymentDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: {
        model: db["Student"],
        required: true,
        attributes: ["StudentName"],
        include: {
          model: db["StudentClass"],
          required: true,
          attributes: ["ClassId"],
          include: {
            model: db["Class"],
            required: true,
            attributes: ["ClassId"],
            include: {
              model: db["Grade"],
              required: true,
              attributes: ["GradeName"],
            },
          },
        },
      },
    })
    .then((payments) =>
      payments
        .map((payment) => {
          const pay = payment.toJSON();
          return [
            pay["Student"]["StudentName"],
            pay["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
            pay["PaymentType"] === "Bus" ? "باص" : "خدمات",
            pay["PaymentAmount"],
            pay["PaymentDate"],
          ];
        })
        .then((payments) => {
          const total = payments.reduce(
            (sum, payment) => (sum += payment[3]),
            0,
          );
          payments.push(["المجموع", "", "", total, ""]);
          return payments;
        }),
    )
    .catch(console.err);
};
