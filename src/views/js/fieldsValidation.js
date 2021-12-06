const checkStudentData = () => {
  let errors = [];
  let StudentName = document.getElementById("StudentName").value;
  let StudentNationalId = document.getElementById("StudentNationalId").value;
  let StudentPassportId = document.getElementById("StudentPassportId").value;
  let StudentBirthDate = document.getElementById("StudentBirthDate").value;
  let StudentRegisterDate = document.getElementById(
    "StudentRegisterDate",
  ).value;
  let StudentAddress = document.getElementById("StudentAddress").value;
  let StudentNationalityId = document.getElementById(
    "StudentNationalities",
  ).value;
  let StudentSex = document.getElementById("StudentSex").value;
  let StudentSiblingOrder = document.getElementById(
    "StudentSiblingOrder",
  ).value;
  let StudentHealth = document.getElementById("StudentHealth").value;
  let StudentFamilyStatus = document.getElementById(
    "StudentFamilyStatus",
  ).value;
  let StudentClassId = document.getElementById("ClassList").value;
  // check length of all attrs
  if (
    StudentName.length === 0 ||
    StudentBirthDate.length === 0 ||
    StudentAddress.length === 0 ||
    !StudentNationalityId ||
    !StudentSex ||
    !StudentSiblingOrder ||
    !StudentFamilyStatus ||
    !StudentClassId ||
    StudentRegisterDate.length === 0
  ) {
    errors.push("من فضلك ادخل جميع الحقول في بيانات الطالب");
  }
  if (StudentNationalId.length === 0 && StudentPassportId.length === 0) {
    errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للطالب");
  }
  if (StudentPassportId.length === 0) {
    StudentPassportId = null;
  }
  if (StudentNationalId.length === 0) {
    StudentNationalId = null;
  }
  if (errors.length === 0) {
    return {
      errors: [],
      data: {
        studentData: {
          StudentName,
          StudentNationalId,
          StudentPassportId,
          StudentBirthDate,
          StudentRegisterDate,
          StudentAddress,
          StudentNationalityId,
          StudentSex,
          StudentSiblingOrder,
          StudentHealth,
          StudentFamilyStatus,
        },
        StudentClassId,
      },
    };
  } else {
    return {
      errors,
      data: null,
    };
  }
};
const checkFatherData = () => {
  let errors = [];
  let DeadDadTrigger = document.getElementById("DeadDadTrigger").checked;
  let DadName = document.getElementById("DadName").value;
  let DadNationalId = document.getElementById("DadNationalId").value;
  let DadPassportId = document.getElementById("DadPassportId").value;
  let DadAddress = document.getElementById("DadAddress").value;
  let DadAcademicDegree = document.getElementById("DadAcademicDegree").value;
  let DadworkAreaChilds = document.getElementById("DadworkArea").children;
  let dadphoneAreaChilds = document.getElementById("dadphoneArea").children;
  if (
    DadName.length === 0 ||
    DadAddress.length === 0 ||
    DadAcademicDegree.length === 0 || DadAcademicDegree === 0
  ) {
    errors.push("من فضلك ادخل جميع الحقول في بيانات الأب");
  }
  if (DadNationalId.length === 0 && DadPassportId.length === 0) {
    errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للأب");
  }
  if (DadNationalId.length === 0) {
    DadNationalId = null;
  }
  if (DadPassportId.length === 0) {
    DadPassportId = null;
  }
  // hundle jobs
  let jobs = [];
  for (let i = 0; i < DadworkAreaChilds.length; i++) {
    const childs = DadworkAreaChilds[i].children;
    let ParentJobId = childs[0].children[0].value;
    let ParentJobAddress = childs[1].children[0].children[1].value;
    if (ParentJobAddress === "") continue;
    jobs.push({
      ParentJobId,
      ParentJobAddress,
    });
  }
  if (jobs.length === 0) {
    errors.push("يجب ادخال مكان عمل واحد على الأققل للأب");
  }
  // hundle phones
  let phones = [];
  for (let i = 0; i < dadphoneAreaChilds.length; i++) {
    const childs = dadphoneAreaChilds[i].children;
    let val = childs[0].children[0].children[1].value;
    if (val === "") continue;
    phones.push(val);
  }
  if (phones.length === 0) {
    errors.push("يجب إدخال رقم واحد على الأققل للأب");
  }
  if (errors.length === 0) {
    console.log("test");
    return {
      errors: [],
      fatherData: {
        ParentData: {
          ParentNationalId: DadNationalId,
          ParentPassportId: DadPassportId,
          ParentName: DadName,
          ParentAddress: DadAddress,
          ParentNationalityId: 1,
          ParentAcademicDegree: DadAcademicDegree,
          IsDead : DeadDadTrigger
        },
        phones,
        jobs,
      },
    };
  } else {
    return {
      errors,
      data: null,
    };
  }
};
const checkMotherData = () => {
  let errors = [];
  let DeadMomTrigger = document.getElementById("DeadMomTrigger").checked;
  let MomName = document.getElementById("MomName").value;
  let MomNationalId = document.getElementById("MomNationalId").value;
  let MomPassportId = document.getElementById("MomPassportId").value;
  let MomAddress = document.getElementById("MomAddress").value;
  let MomAcademicDegree = document.getElementById("MomAcademicDegree").value;
  let MomWorkAreaChilds = document.getElementById("MomWorkArea").children;
  let MomPhoneAreaChilds = document.getElementById("MomPhoneArea").children;
  if (
    MomName.length === 0 ||
    MomAddress.length === 0 ||
    MomAcademicDegree.length === 0 || MomAcademicDegree === 0
  ) {
    errors.push("من فضلك ادخل جميع الحقول في بيانات الأب");
  }
  if (MomNationalId.length === 0 && MomPassportId.length === 0) {
    errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للأب");
  }
  if (MomNationalId.length === 0) {
    MomNationalId = null;
  }
  if (MomPassportId.length === 0) {
    MomPassportId = null;
  }
  // hundle jobs
  let jobs = [];
  for (let i = 0; i < MomWorkAreaChilds.length; i++) {
    const childs = MomWorkAreaChilds[i].children;
    let ParentJobId = childs[0].children[0].value;
    let ParentJobAddress = childs[1].children[0].children[1].value;
    if (ParentJobAddress === "") continue;
    jobs.push({
      ParentJobId,
      ParentJobAddress,
    });
  }
  if (jobs.length === 0) {
    errors.push("يجب ادخال مكان عمل واحد على الأققل للأم");
  }
  // hundle phones
  let phones = [];
  for (let i = 0; i < MomPhoneAreaChilds.length; i++) {
    const childs = MomPhoneAreaChilds[i].children;
    let val = childs[0].children[0].children[1].value;
    if (val === "") continue;
    phones.push(val);
  }
  if (phones.length === 0) {
    errors.push("يجب إدخال رقم واحد على الأققل للأم");
  }
  if (errors.length === 0) {
    console.log(DeadMomTrigger);
    return {
      errors: [],
      motherData: {
        ParentData: {
          ParentNationalId: MomNationalId,
          ParentPassportId: MomPassportId,
          ParentName: MomName,
          ParentAddress: MomAddress,
          ParentNationalityId: 1,
          ParentAcademicDegree: MomAcademicDegree,
          IsDead : DeadMomTrigger
        },
        phones,
        jobs,
      },
    };
  } else {
    return {
      errors,
      data: null,
    };
  }
};
const checkResData = () => {
  let errors = [];
  let StudentResponsibleRelationSelect = document.getElementById(
    "StudentResponsibleRelationSelect",
  ).value;
  let StudentResponsibleRelation = document.getElementById(
    "StudentResponsibleRelation",
  ).value;
  let ResName = document.getElementById("ResName").value;
  let ResNationalId = document.getElementById("ResNationalId").value;
  let ResPassportId = document.getElementById("ResPassportId").value;
  let ResAddress = document.getElementById("ResAddress").value;
  let ResAcademicDegree = document.getElementById("ResAcademicDegree").value;
  let ResWorkAreaChilds = document.getElementById("ResWorkArea").children;
  let ResPhoneAreaChilds = document.getElementById("ResPhoneArea").children;
  let DeadMomTrigger = document.getElementById("DeadMomTrigger").checked;
  let DeadDadTrigger = document.getElementById("DeadDadTrigger").checked;
  console.log(DeadMomTrigger, StudentResponsibleRelationSelect);
  if (DeadDadTrigger && StudentResponsibleRelationSelect === "father") {
    errors.push("لا يمكن اختيار الأب ك ولي أمر وهو متوفي");
  }
  if (DeadMomTrigger && StudentResponsibleRelationSelect === "mother") {
    errors.push("لا يمكن اختيار الأم ك ولي أمر وهي متوفيه");
  }
  if (StudentResponsibleRelationSelect === "father")
    return { errors, ResData: ["father", {}] };
  if (StudentResponsibleRelationSelect === "mother")
    return { errors, ResData: ["mother", {}] };

  if (StudentResponsibleRelation.length === 0) {
    errors.push("يجب ادخال صله القرابه بين الطالب وولي الأمر");
  }

  if (
    ResName.length === 0 ||
    ResAddress.length === 0 ||
    ResAcademicDegree.length === 0 || ResAcademicDegree === 0
  ) {
    errors.push("من فضلك ادخل جميع الحقول في بيانات ولي الأمر");
  }
  if (ResNationalId.length === 0 && ResPassportId.length === 0) {
    errors.push("يجب ادخال الرقم القومي او رقم الباسبورت لولي الأمر");
  }
  if (ResNationalId.length === 0) {
    ResNationalId = null;
  }
  if (ResPassportId.length === 0) {
    ResPassportId = null;
  }
  // hundle jobs
  let jobs = [];
  for (let i = 0; i < ResWorkAreaChilds.length; i++) {
    const childs = ResWorkAreaChilds[i].children;
    let ParentJobId = childs[0].children[0].value;
    let ParentJobAddress = childs[1].children[0].children[1].value;
    if (ParentJobAddress === "") continue;
    jobs.push({
      ParentJobId,
      ParentJobAddress,
    });
  }
  if (jobs.length === 0) {
    errors.push("يجب ادخال مكان عمل واحد على الأققل للأم");
  }
  // hundle phones
  let phones = [];
  for (let i = 0; i < ResPhoneAreaChilds.length; i++) {
    const childs = ResPhoneAreaChilds[i].children;
    let val = childs[0].children[0].children[1].value;
    if (val === "") continue;
    phones.push(val);
  }
  if (phones.length === 0) {
    errors.push("يجب إدخال رقم واحد على الأققل لولي الأمر");
  }
  if (errors.length === 0) {
    return {
      errors: [],
      ResData: [
        StudentResponsibleRelation,
        {
          ParentData: {
            ParentNationalId: ResNationalId,
            ParentPassportId: ResPassportId,
            ParentName: ResName,
            ParentAddress: ResAddress,
            ParentNationalityId: 1,
            ParentAcademicDegree: ResAcademicDegree,
          },
          phones,
          jobs,
        },
      ],
    };
  } else {
    return {
      errors,
      data: null,
    };
  }
};

//check absence data
const checkAddAbsenceData = () => {
  let errors = [];
  const AbsentDate = document.getElementById("AbsentDate").value;
  const AbsentReason = document.getElementById("AbsentReasons").value;
  if (AbsentReason.length === 0 || AbsentDate.length === 0) {
    errors.push("من فضلك ادخل التاريخ وسبب الغياب لإضافه غياب جديد للطالب");
  }
  if (errors.length === 0) {
    return {
      errors: [],
      data: {
        AbsentReason,
        AbsentDate,
      },
    };
  } else {
    return {
      errors,
      data: {},
    };
  }
};

const checkTransferStudentData = () => {
  let errors = [];
  const transferredSchoolName = document.getElementById(
    "transferredSchoolName",
  ).value;
  const transferredSchoolType = document.getElementById(
    "transferredSchoolType",
  ).value;
  const transferType = document.getElementById(
    "transferType",
  ).value;
  if (transferredSchoolName.length === 0) {
    errors.push("يجب ادخال اسم المدرسة المحول إليها");
  }
  if (transferredSchoolType.length === 0) {
    errors.push("يجب ادخال نوع المدرسة المحول إليها");
  }
  if (transferType.length === 0) {
    errors.push("يجب ادخال نوع التحويل");
  }
  if (errors.length === 0) {
    return {
      errors: [],
      data: {
        transferredSchoolName,
        transferredSchoolType,
        transferType,
      },
    };
  } else {
    return {
      errors,
      data: {},
    };
  }
};
// check categories table
const checkCategoriesTable = (parentId) => {
  const Rows = document.getElementById(parentId).children;
  let isEmpty = true;
  let catsMoney = [];
  let errors = [];
  for (let i = 0; i < Rows.length; i++) {
    const catId = Rows[i].dataset.categoryid;
    const CategoryName = Rows[i].dataset.categoryname;
    const remainingCost = Number(Rows[i].dataset.remainingcost);
    const amount = Number(Rows[i].children[5].children[0].value);
    if (amount > remainingCost) {
      errors.push(
        "المبلغ المتبقي من " +
        CategoryName +
        "هو " +
        remainingCost +
        " \n لا يمكن الاضافه اكثر من ذلك",
      );
    }
    if (amount !== 0) {
      isEmpty = false;
      catsMoney.push({
        CategoryId: catId,
        amount,
      });
    }
  }
  if (isEmpty) {
    errors.push("من فضلك ادخل مبلغ في اي خدمه ليتم دفعه");
  }
  if (errors.length === 0) {
    return {
      errors: [],
      catsMoney,
    };
  } else {
    return {
      errors,
      catsMoney: {},
    };
  }
};

const checkNewExpenses = () => {
  let errors = [];
  const totalCost = document.getElementById("totalCost").value;
  const GradeId = document.getElementById("add-AllGradesSelect").value;
  const GradeName = document.getElementById("add-AllGradesSelect")[
    document.getElementById("add-AllGradesSelect").selectedIndex
  ].dataset.gradename;
  const firstInstallmentPortion = document.getElementById(
    "firstInstallmentPortion",
  ).value;
  if (
    String(totalCost.length) === 0 ||
    String(GradeId).length === 0 ||
    String(firstInstallmentPortion).length === 0
  ) {
    errors.push("يجب ملء جميع الخانات");
  }
  if (Number(totalCost) <= 0) {
    errors.push("تكلفة المصاريف يجب ان تكون اكبر من 0");
  }
  if (
    Number(firstInstallmentPortion) === 0 ||
    Number(firstInstallmentPortion) >= 100
  ) {
    errors.push("نسبة الترم الاأول يجب ان تكون بين 1 و 99 في الميه");
  }
  // get services
  const servicesDiv = document.getElementById("services");
  const Categories = [];
  for (let i = 0; i < servicesDiv.children.length; i++) {
    const Row = servicesDiv.children[i];
    let CategoryName = Row.children[0].children[0].children[1].value;
    let CategoryCost = Number(Row.children[1].children[0].children[1].value);
    if (CategoryName.length === 0) {
      errors.push("يجب ادخال اسم الخدمه");
      break;
    }
    if (String(CategoryCost).length === 0) {
      errors.push("يجب إدخال قيمه الخدمه");
      break;
    }
    if (CategoryCost <= 0) {
      errors.push("تكلفة الخدمة يجب ان تكون اكبر من 0");
      break;
    }
    Categories.push({
      CategoryName,
      CategoryCost,
    });
  }
  // check the sum of all cats cost == total cost
  let CategoriesSum = 0;
  Categories.forEach((cat) => {
    CategoriesSum += cat.CategoryCost;
  });
  if (CategoriesSum !== Number(totalCost)) {
    errors.push("مجموع تكلفة الخدمات يجيب ان يساوي التكلفة الكلية للمصاريف");
  }
  if (errors.length === 0) {
    return {
      errors: [],
      data: {
        totalCost: Number(totalCost),
        GradeId: Number(GradeId),
        GradeName,
        firstInstallmentPortion: Number(firstInstallmentPortion),
        Categories,
      },
    };
  } else {
    return {
      errors,
      data: {},
    };
  }

  // servicesDiv.children.forEach(Row => {
  //     console.log(Row.children.children);
  // });
};
const getRoutesDataFromTable = () => {
  let errors = [];
  let finalRoutes = [];
  const table = document.getElementById("ٌRoutesTable");
  for (let i = 0; i < table.children.length; i++) {
    const row = table.children[i];
    let BusRouteId = null;
    if (row.dataset.routeid) {
      BusRouteId = Number(row.dataset.routeid);
    }
    let BusRouteName = row.children[0].children[0].value;
    let BusRouteDriverName = row.children[1].children[0].value;
    let BusRouteCost = Number(row.children[2].children[0].value);
    if (BusRouteName.length === 0 || BusRouteDriverName.length === 0) {
      errors.push(['من فضلك تاكد من أن جميع الخانات في الجدول مدخله']);
      break;
    }
    if (BusRouteCost <= 0) {
      errors.push(['يجب أن تكون تكلفة الخط اكبر من 0']);
      break;
    }
    finalRoutes.push({
      BusRouteId,
      BusRouteName,
      BusRouteDriverName,
      BusRouteCost
    });
  }
  if (errors.length === 0) {
    return {
      errors: [],
      finalRoutes
    };
  } else {
    return {
      errors,
      finalRoutes: []
    };
  }
};

const checkNewRoute = () => {
  let errors = []
  const BusRouteName = document.getElementById("BusRouteName").value;
  const BusRouteDriverName = document.getElementById("BusRouteDriverName").value;
  const BusRouteCost = Number(document.getElementById("BusRouteCost").value);
  if (BusRouteName.length === 0 || BusRouteDriverName.length === 0) {
    errors.push(['من فضلك تاكد من أن جميع الخانات مدخلة']);
  }
  if (BusRouteCost <= 0) {
    errors.push(['يجب أن تكون تكلفة الخط اكبر من 0']);
  }
  if (errors.length === 0) {
    return {
      errors: [],
      newRoute: {
        BusRouteId : null,
        BusRouteName,
        BusRouteDriverName,
        BusRouteCost
      }
    };
  }else {
    return {
      errors,
      newRoute : {}
    };
  }
};
