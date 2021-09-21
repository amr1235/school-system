const { getSeatsData, studentsOfColleagues } = require("./affairs");

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
  },
};

module.exports = Reports;
