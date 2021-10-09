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

exports.RemainingFirstOrSecond = async (semester) => {
  let AcademicYear = await db["GlobalValues"]
    .findOne()
    .then((result) => result.toJSON().GlobalValue);
  AcademicYear =
    semester === "first-install"
      ? AcademicYear.split("/")[0]
      : AcademicYear.split("/")[1];
  let firstInstallmentDueDate = new Date(
    new Date().setFullYear(Number(AcademicYear), 11, 31),
  ).toISOString();

  return db["Installment"]
    .findAll({
      where: {
        [Op.and]: {
          InstallmentName: semester,
          InstallmentDueDate: firstInstallmentDueDate,
          InstallmentFullyPaidDate: null,
        },
      },
      attributes: ["StudentId", "InstallmentAmount", "InstallmentPaidAmount"],
      include: {
        model: db["Student"],
        required: true,
        attributes: ["StudentName", "StudentResponsibleId"],
        include: {
          model: db["Parent"],
          as: "Responsible",
          required: true,
          attributes: ["ParentId", "ParentName"],
          include: {
            model: db["ParentPhone"],
            attributes: ["ParentPhoneNumber"],
            required: true,
          },
        },
      },
    })
    .then((paied) =>
      paied.map((payment) => {
        return [
          payment["Student"]["StudentName"],
          payment["Student"]["Responsible"]["ParentName"],
          payment["Student"]["Responsible"]["ParentPhoneNumber"]
            ? payment["Student"]["Responsible"]["ParentPhoneNumber"].join(", ")
            : "غير متوفر",
          payment["InstallmentAmount"],
          payment["InstallmentPaidAmount"],
          payment["InstallmentAmount"] - payment["InstallmentPaidAmount"],
        ];
      }),
    )
    .then((remainder) => {
      const totalRequired = remainder.reduce(
        (sum, remaining) => sum + remaining[3],
        0,
      );
      const totalPaid = remainder.reduce(
        (sum, remaining) => sum + remaining[4],
        0,
      );
      const totalRemainder = remainder.reduce(
        (sum, remaining) => sum + remaining[5],
        0,
      );
      remainder.push([
        "المجموع",
        "",
        "",
        totalRequired,
        totalPaid,
        totalRemainder,
      ]);
      return remainder;
    })
    .catch(console.error);
};

exports.FullyFirstOrSecond = async (semester) => {
  let AcademicYear = await db["GlobalValues"]
    .findOne()
    .then((result) => result.toJSON().GlobalValue);
  AcademicYear =
    semester === "first-install"
      ? AcademicYear.split("/")[0]
      : AcademicYear.split("/")[1];
  let firstInstallmentDueDate = new Date(
    new Date().setFullYear(Number(AcademicYear), 11, 31),
  ).toISOString();

  return db["Installment"]
    .findAll({
      where: {
        [Op.and]: {
          InstallmentName: semester,
          InstallmentDueDate: firstInstallmentDueDate,
          InstallmentFullyPaidDate: {
            [Op.ne]: null,
          },
        },
      },
      attributes: ["StudentId", "InstallmentAmount", "InstallmentPaidAmount"],
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
    .then((paied) =>
      paied.map((payment) => {
        return [
          payment["Student"]["StudentName"],
          payment["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          payment["InstallmentAmount"],
          payment["InstallmentPaidAmount"],
        ];
      }),
    )
    .then((remainder) => {
      const totalRequired = remainder.reduce(
        (sum, remaining) => sum + remaining[2],
        0,
      );
      const totalPaid = remainder.reduce(
        (sum, remaining) => sum + remaining[3],
        0,
      );
      remainder.push(["المجموع", "", totalRequired, totalPaid]);
      return remainder;
    })
    .catch(console.error);
};
