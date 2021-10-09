const {
  getSeatsData,
  studentsOfColleagues,
  getAbsenceRatioInAllGrades,
  getTransferredStudents,
  getGradeCapacity,
  AbsentDays,
} = require("./affairs");

const { getDailyReport, getMonthlyReport } = require("./expanses");

const Reports = {
  Affairs: {
    Seats: {
      query: getSeatsData,
      headers: ["رقم الجلوس", "اسم الطالب"],
      title: "أرقام الجلوس",
    },
    StudentsOfColleagues: {
      query: studentsOfColleagues,
      headers: ["اسم الطالب", "الصف", "صلة قرابة العامل بالمعهد", "اسم العامل"],
      title: "أبناء العاملين بالمعهد",
    },
    AbsenceRate: {
      query: getAbsenceRatioInAllGrades,
      headers: [
        "المرحلة",
        "إجمالي الغياب خلال الفترة",
        "نسبة الغياب خلال الفترة",
      ],
      title: "نسبة الغياب",
    },
    TransferredStudents: {
      query: getTransferredStudents,
      headers: ["اسم الطالب", "اسم المدرسة المحول لها", "تاريخ التحويل"],
      title: "المحولين من المدرسة",
    },
    GradeCapacity: {
      query: getGradeCapacity,
      headers: ["الفصل", "الكثافة"],
      title: "كثافة الفصول والمراحل",
    },
    AllAbsents: {
      query: AbsentDays,
      headers: ["الصف", "الفصل", "اسم الطالب", "سبب الغياب", "تاريخ الغياب"],
      title: "الغياب",
    },
  },
  Expanses: {
    DailyExpanses: {
      query: getDailyReport,
      headers: [
        "اسم الطالب",
        "الصف",
        "نوع المصاريف",
        "المبلغ المدفوع",
        "تاريخ الدفع",
      ],
      title: "التوريد اليومي",
    },
    MonthlyExpanses: {
      query: getMonthlyReport,
      headers: [
        "اسم الطالب",
        "الصف",
        "نوع المصاريف",
        "المبلغ المدفوع",
        "تاريخ الدفع",
      ],
      title: "التوريد الشهري",
    },
  },
};

module.exports = Reports;
