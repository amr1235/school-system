const {
  getSeatsData,
  studentsOfColleagues,
  getAbsenceRatioInAllGrades,
  getTransferredStudents,
  getGradeCapacity,
  AbsentDays,
  studentsAges,
  siblings,
  motherData,
  classList,
} = require("./affairs");

const {
  getDailyReport,
  getMonthlyReport,
  RemainingFirstOrSecond,
  FullyFirstOrSecond,
  fullyPaidCategory,
  ToBeCollected,
  notPaidStudents,
  remainingFromPostponed,
} = require("./expanses");

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
      headers: ["اسم الطالب", "اسم المدرسة المحول لها", "نوع المدرسة", "نوع التحويل", "تاريخ التحويل"],
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
    StudentsAges: {
      query: studentsAges,
      headers: [
        "اسم الطالب",
        "تاريخ الميلاد",
        "العمر",
        "الجنسية",
        "اسم ولي الأمر",
        "وظيفة ولي الأمر",
        "عنوان ولي الأمر",
        "الصف",
      ],
      title: "أعمار الطلاب",
    },
    siblings: {
      query: siblings,
      headers: ["اسم الطالب", "الصف", "الفصل"],
      title: "الأشقاء"
    },
    motherData: {
      query: motherData,
      headers: ["اسم الطالب", "اسم الأم", "المؤهل", "الوظيفة", "حالة الأسرة", "الهاتف", "العنوان"],
      title: "بيانات الأم",
    },
    classList: {
      query: classList,
      headers: ["اسم الطالب", "ملاحظات"],
      title: "قائمة الطلاب",
    }
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
    RemainingFirst: {
      query: RemainingFirstOrSecond,
      headers: [
        "اسم الطالب",
        "اسم ولي الأمر",
        "رقم تليفون ولي الأمر",
        "القسط الأول",
        "المسدد",
        "الباقي",
      ],
      title: "الباقي قسط أول",
    },
    RemainingSecond: {
      query: RemainingFirstOrSecond,
      headers: [
        "اسم الطالب",
        "اسم ولي الأمر",
        "رقم تليفون ولي الأمر",
        "القسط الثاني",
        "المسدد",
        "الباقي",
      ],
      title: "الباقي قسط ثاني",
    },
    FullyFirst: {
      query: FullyFirstOrSecond,
      headers: ["اسم الطالب", "الصف", "القسط الأول", "المسدد"],
      title: "مسددين قسط أول",
    },
    FullySecond: {
      query: FullyFirstOrSecond,
      headers: ["اسم الطالب", "الصف", "القسط الثاني", "المسدد"],
      title: "مسددين قسط ثاني",
    },
    ToBeCollectedCategoriesFirstSemester: {
      query: ToBeCollected,
      headers: ["الصف", "عدد الطلاب في الصف", "المتوقع تحصيله"],
      title: "المتوقع تحصيله من القسط الأول",
    },
    ToBeCollectedCategoriesSecondSemester: {
      query: ToBeCollected,
      headers: ["الصف", "عدد الطلاب في الصف", "المتوقع تحصيله"],
      title: "المتوقع تحصيله من القسط الثاني",
    },
    ToBeCollectedCategoriesFullYear: {
      query: ToBeCollected,
      headers: ["الصف", "عدد الطلاب في الصف", "المتوقع تحصيله"],
      title: "المتوقع تحصيله من القسطين معًا",
    },
    RemainingBusFirstSemester: {
      query: notPaidStudents,
      headers: ["اسم الطالب", "الصف", "قيمة القسط", "المدفوع", "الباقي"],
      title: "الغير مسددين سيارة قسط أول",
    },
    RemainingBusSecondSemester: {
      query: notPaidStudents,
      headers: ["اسم الطالب", "الصف", "قيمة القسط", "المدفوع", "الباقي"],
      title: "الغير مسددين سيارة قسط ثاني",
    },
    getFullyPaidSelectedCategories: {
      query: fullyPaidCategory,
      headers: [""],
      title: "المسددين من الأقساط",
    },
    remainingFromPostponed: {
      query: remainingFromPostponed,
      headers: [
        "اسم الطالب",
        "الصف",
        "نوع المصاريف",
        "المطلوب",
        "المدفوع",
        "الباقي",
      ],
      title: "الباقي من المرحل",
    },
  },
};

module.exports = Reports;
