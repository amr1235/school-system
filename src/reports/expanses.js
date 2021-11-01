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
    .then((payments) => {
      return payments.map((payment) => {
        const pay = payment.toJSON();
        return [
          pay["Student"]["StudentName"],
          pay["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          pay["PaymentType"] === "Bus" ? "باص" : "خدمات",
          pay["PaymentAmount"],
          pay["PaymentDate"],
        ];
      });
    })
    .then((payments) => {
      const total = payments.reduce((sum, payment) => (sum += payment[3]), 0);
      payments.push(["المجموع", "", "", total, ""]);
      return payments;
    })
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

exports.fullyPaidCategory = async (gradeId, categories) => {
  let CurrentAcademicYear = await db["GlobalValues"]
    .findOne({
      where: {
        GlobalName: "AcademicYear",
      },
    })
    .then((res) => res.toJSON().GlobalValue);
  let where = "";
  categories.forEach((category) => {
    where += `"CategoryName"='${category}' AND `;
  });
  where = where.substring(0, where.length - 4);
  return db.sequelize
    .query(
      'SELECT * FROM (\
  SELECT "StudentId","CategoryId","CategoryName","CategoryCost",SUM("TotalPaid") As "Paid" FROM (SELECT "StudentId", "CategoryId","CategoryName","CategoryCost", 0 AS "TotalPaid" From(\
  SELECT "Student"."StudentId","Category"."CategoryId","Category"."CategoryName", "Category"."CategoryCost" from "Student"\
  JOIN "StudentClass" on "Student"."StudentId"="StudentClass"."StudentId"\
  JOIN "Class" on "StudentClass"."ClassId"="Class"."ClassId"\
  JOIN "Category" on "Class"."GradeId" = "Category"."GradeId"\
  ) AS "STUD"\
  UNION\
  SELECT * FROM (\
  SELECT "Payment"."StudentId", "PaymentCategory"."CategoryId", "Category"."CategoryName", "Category"."CategoryCost", SUM("PaymentCategory"."Amount") AS "TotalPaid" FROM "Payment"\
  JOIN "PaymentCategory" ON "Payment"."PaymentId"="PaymentCategory"."PaymentId"\
  JOIN "Category" ON "PaymentCategory"."CategoryId"="Category"."CategoryId"\
  GROUP BY "Payment"."StudentId", "PaymentCategory"."CategoryId", "Category"."CategoryName", "Category"."CategoryCost"\
  ) AS "STUDS" ) AS "Result" GROUP BY "StudentId","CategoryId","CategoryName","CategoryCost"\
  ) AS "TOTAL"\
  WHERE ( ' +
        where +
        ' ) AND ("Paid" = "CategoryCost")',
    )
    .then((res) => res[0]);
};

// fullyPaidCategory(1, ["books"]).then(console.log);

exports.ToBeCollected = async (semester, category) => {
  let CurrentAcademicYear = await db["GlobalValues"]
    .findOne({
      where: {
        GlobalName: "AcademicYear",
      },
    })
    .then((res) => res.toJSON().GlobalValue.split("/"));

  const commonQuery =
    'SELECT "Grade"."GradeId", "Grade"."GradeName", COUNT("Student"."StudentId"), SUM("Installment"."InstallmentAmount") FROM "Installment"\
  RIGHT JOIN "Student" ON "Installment"."StudentId" = "Student"."StudentId"\
  JOIN "StudentClass" ON "Student"."StudentId" = "StudentClass"."StudentId"\
  JOIN "Class" ON "StudentClass"."ClassId" = "Class"."ClassId"\
  JOIN "Grade" ON "Class"."GradeId" = "Grade"."GradeId" WHERE "Installment"."InstallmentType" = \'' +
    category +
    "' ";

  const firstSemesterQuery =
    ' AND "Installment"."InstallmentName" = \'' +
    semester +
    '\' AND extract(year from "Installment"."InstallmentDueDate") = \'' +
    +CurrentAcademicYear[0] +
    "'" +
    ' GROUP BY "Grade"."GradeId"\
    ORDER BY "Grade"."GradeId"';
  const secondSemesterQuery =
    ' AND "Installment"."InstallmentName" = \'' +
    semester +
    '\' AND extract(year from "Installment"."InstallmentDueDate") = \'' +
    +CurrentAcademicYear[1] +
    "'" +
    ' GROUP BY "Grade"."GradeId"\
  ORDER BY "Grade"."GradeId"';
  const fullYearQuery =
    ' AND extract(year from "Installment"."InstallmentDueDate") IN (\'' +
    +CurrentAcademicYear[0] +
    "', " +
    "'" +
    CurrentAcademicYear[1] +
    "')" +
    ' GROUP BY "Grade"."GradeId"\
  ORDER BY "Grade"."GradeId"';

  const query =
    semester === "first-install"
      ? commonQuery + " " + firstSemesterQuery
      : semester === "second-install"
      ? commonQuery + " " + secondSemesterQuery
      : commonQuery + " " + fullYearQuery;

  return db.sequelize
    .query(query)
    .then((grades) =>
      grades[0].map((grade) => {
        return [
          grade["GradeName"],
          semester ? parseInt(grade["count"]) : parseInt(grade["count"]) / 2,
          parseInt(grade["sum"]),
        ];
      }),
    )
    .then((grades) => {
      let totalStudents = grades.reduce((sum, grade) => sum + grade[1], 0);
      const totalMoney = grades.reduce((sum, grade) => sum + grade[2], 0);
      // grades.push(["المجموع", totalMoney]);
      grades.push(["المجموع", totalStudents, totalMoney]);
      return grades;
    });
};

// ToBeCollected("first-install", "Category").then(console.log);

exports.notPaidStudents = async (semester, category) => {
  let CurrentAcademicYear = await db["GlobalValues"]
    .findOne({
      where: {
        GlobalName: "AcademicYear",
      },
    })
    .then((res) => res.toJSON().GlobalValue.split("/"));
  const firstSemester = CurrentAcademicYear[0] + "-12-31";
  const secondSemester = CurrentAcademicYear[1] + "-08-31";
  const year = semester === "first-install" ? firstSemester : secondSemester;
  return db["Installment"]
    .findAll({
      attributes: ["InstallmentAmount", "InstallmentPaidAmount"],
      where: {
        InstallmentType: category,
        InstallmentName: semester,
        InstallmentDueDate: year,
        Status: {
          [Op.in]: ["DUE", "LATE"],
        },
        InstallmentPaidAmount: {
          [Op.ne]: db.sequelize.col("InstallmentAmount"),
        },
      },
      include: {
        model: db["Student"],
        attributes: ["StudentName"],
        required: true,
        include: {
          model: db["StudentClass"],
          required: true,
          include: {
            model: db["Class"],
            required: true,
            include: {
              model: db["Grade"],
              attributes: ["GradeName"],
              required: true,
            },
          },
        },
      },
    })
    .then((students) =>
      students.map((student) => {
        const row = student.toJSON();
        return [
          row["Student"]["StudentName"],
          row["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          row["InstallmentAmount"],
          row["InstallmentPaidAmount"],
          parseInt(row["InstallmentAmount"]) -
            parseInt(row["InstallmentPaidAmount"]),
        ];
      }),
    )
    .then((students) => {
      const totalRemainder = students.reduce(
        (sum, student) => sum + student[4],
        0,
      );
      const totalInstallmentsAmount = students.reduce(
        (sum, student) => sum + student[2],
        0,
      );
      const totalInstallmentsPaidAmount = students.reduce(
        (sum, student) => sum + student[3],
        0,
      );
      students.push([
        "المجموع",
        "",
        totalInstallmentsAmount,
        totalInstallmentsPaidAmount,
        totalRemainder,
      ]);
      return students;
    })
    .catch(console.error);
};

exports.remainingFromPostponed = async () => {
  return db["Installment"]
    .findAll({
      where: {
        [Op.and]: {
          Status: "FROMLASTYEAR",
          InstallmentAmount: {
            [Op.ne]: db.sequelize.col("InstallmentPaidAmount"),
          },
        },
      },
      attributes: [
        "StudentId",
        "InstallmentAmount",
        "InstallmentPaidAmount",
        "InstallmentType",
      ],
      include: {
        model: db["Student"],
        attributes: ["StudentName"],
        required: true,
        include: {
          model: db["StudentClass"],
          required: true,
          include: {
            model: db["Class"],
            required: true,
            include: {
              model: db["Grade"],
              attributes: ["GradeName"],
              required: true,
            },
          },
        },
      },
    })
    .then((postponed) => {
      return postponed.map((payment) => {
        return [
          payment["Student"]["StudentName"],
          payment["Student"]["StudentClass"]["Class"]["Grade"]["GradeName"],
          payment["InstallmentType"],
          payment["InstallmentAmount"],
          payment["InstallmentPaidAmount"],
          parseInt(payment["InstallmentAmount"]) -
            parseInt(payment["InstallmentPaidAmount"]),
        ];
      });
    })
    .then((payments) => {
      const totalCategory = payments.reduce(
        (sum, payment) => sum + payment[3],
        0,
      );
      const totalPaid = payments.reduce((sum, payment) => sum + payment[4], 0);
      const totalRemainder = payments.reduce(
        (sum, payment) => sum + payment[5],
        0,
      );
      payments.push([
        "المجموع",
        "",
        "",
        totalCategory,
        totalPaid,
        totalRemainder,
      ]);
      return payments;
    })
    .catch(console.error);
};
