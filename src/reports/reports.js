const {
  getSeatsData,
  studentsOfColleagues,
  getAbsenceRatioInAllGrades,
} = require("./affairs");

const Reports = {
  Affairs: {
    Seats: {
      query: getSeatsData,
      headers: ["رقم الجلوس", "اسم الطالب"],
      title: "أرقام الجلوس",
    },
    StudentsOfColleagues: {
      query: studentsOfColleagues,
      headers: ["الوالد", "اسم الطالب", "المرحلة", "الفصل"],
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
  },
};

module.exports = Reports;
