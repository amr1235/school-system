const checkStudentData = () => {
    let errors = [];
    let StudentName = document.getElementById("StudentName").value;
    let StudentNationalId = document.getElementById("StudentNationalId").value;
    let StudentPassportId = document.getElementById("StudentPassportId").value;
    let StudentBirthDate = document.getElementById("StudentBirthDate").value;
    let StudentRegisterDate = document.getElementById("StudentRegisterDate").value;
    let StudentAddress = document.getElementById("StudentAddress").value;
    let StudentNationalityId = document.getElementById("StudentNationalities").value;
    let StudentSex = document.getElementById("StudentSex").value;
    let StudentSiblingOrder = document.getElementById("StudentSiblingOrder").value;
    let StudentHealth = document.getElementById("StudentHealth").value;
    let StudentFamilyStatus = document.getElementById("StudentFamilyStatus").value;
    let StudentClassId = document.getElementById("ClassList").value;
    // check length of all attrs 
    if (StudentName.length === 0 || StudentBirthDate.length === 0 || StudentAddress.length === 0 ||
        !StudentNationalityId || !StudentSex || !StudentSiblingOrder || !StudentFamilyStatus || !StudentClassId
        || StudentRegisterDate.length === 0
    ) {
        errors.push("من فضلك ادخل جميع الحقول في بيانات الطالب");
    }
    if (StudentNationalId.length === 0 && StudentPassportId.length === 0) {
        errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للطالب");
    }
    if (StudentPassportId.length === 0) { StudentPassportId = null; }
    if (StudentNationalId.length === 0) { StudentNationalId = null; }
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
                    StudentFamilyStatus
                },
                StudentClassId
            }
        }
    } else {
        return {
            errors,
            data: null
        }
    }
}
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
    if (DeadDadTrigger) return {errors,fatherData:null};
    if (DadName.length === 0 || DadAddress.length === 0 || DadAcademicDegree.length === 0) {
        errors.push("من فضلك ادخل جميع الحقول في بيانات الأب");
    }
    if (DadNationalId.length === 0 && DadPassportId.length === 0) {
        errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للأب");
    }
    if (DadNationalId.length === 0) { DadNationalId = null; }
    if (DadPassportId.length === 0) { DadPassportId = null; }
    // hundle jobs 
    let jobs = [];
    for (let i = 0; i < DadworkAreaChilds.length; i++) {
        const childs = DadworkAreaChilds[i].children;
        let ParentJobId = childs[0].children[0].value
        let ParentJobAddress = childs[1].children[0].children[1].value
        if (ParentJobAddress === "") continue;
        jobs.push({
            ParentJobId,
            ParentJobAddress
        });
    }
    if (jobs.length === 0) {
        errors.push("يجب ادخال مكان عمل واحد على الأققل للأب");
    }
    // hundle phones
    let phones = [];
    for (let i = 0; i < dadphoneAreaChilds.length; i++) {
        const childs = dadphoneAreaChilds[i].children;
        let val = childs[0].children[0].children[1].value
        if (val === "") continue;
        phones.push(val);
    }
    if (phones.length === 0) {
        errors.push("يجب إدخال رقم واحد على الأققل للأب");
    }
    if (errors.length === 0) {
        return {
            errors: [],
            fatherData: {
                ParentData: {
                    ParentNationalId: DadNationalId,
                    ParentPassportId: DadPassportId,
                    ParentName: DadName,
                    ParentAddress: DadAddress,
                    ParentNationalityId: 1,
                    ParentAcademicDegree: DadAcademicDegree
                },
                phones,
                jobs
            }
        };
    } else {
        return {
            errors,
            data: null
        };
    }
}
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
    if (DeadMomTrigger) return {errors:[],motherData : null};
    if (MomName.length === 0 || MomAddress.length === 0 || MomAcademicDegree.length === 0) {
        errors.push("من فضلك ادخل جميع الحقول في بيانات الأب");
    }
    if (MomNationalId.length === 0 && MomPassportId.length === 0) {
        errors.push("يجب ادخال الرقم القومي او رقم الباسبورت للأب");
    }
    if (MomNationalId.length === 0) { MomNationalId = null; }
    if (MomPassportId.length === 0) { MomPassportId = null; }
    // hundle jobs 
    let jobs = [];
    for (let i = 0; i < MomWorkAreaChilds.length; i++) {
        const childs = MomWorkAreaChilds[i].children;
        let ParentJobId = childs[0].children[0].value;
        let ParentJobAddress = childs[1].children[0].children[1].value;
        if (ParentJobAddress === "") continue;
        jobs.push({
            ParentJobId,
            ParentJobAddress
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
        return {
            errors: [],
            motherData: {
                ParentData: {
                    ParentNationalId: MomNationalId,
                    ParentPassportId: MomPassportId,
                    ParentName: MomName,
                    ParentAddress: MomAddress,
                    ParentNationalityId: 1,
                    ParentAcademicDegree: MomAcademicDegree
                },
                phones,
                jobs
            }
        };
    } else {
        return {
            errors,
            data: null
        };
    }
}
const checkResData = () => {
    let errors = [];
    let StudentResponsibleRelationSelect = document.getElementById("StudentResponsibleRelationSelect").value;
    let StudentResponsibleRelation = document.getElementById("StudentResponsibleRelation").value;
    let ResName = document.getElementById("ResName").value;
    let ResNationalId = document.getElementById("ResNationalId").value;
    let ResPassportId = document.getElementById("ResPassportId").value;
    let ResAddress = document.getElementById("ResAddress").value;
    let ResAcademicDegree = document.getElementById("ResAcademicDegree").value;
    let ResWorkAreaChilds = document.getElementById("ResWorkArea").children;
    let ResPhoneAreaChilds = document.getElementById("ResPhoneArea").children;
    let DeadMomTrigger = document.getElementById("DeadMomTrigger").checked;
    let DeadDadTrigger = document.getElementById("DeadDadTrigger").checked;
    console.log(DeadMomTrigger,StudentResponsibleRelationSelect);
    if(DeadDadTrigger && StudentResponsibleRelationSelect === "father") {
        errors.push("لا يمكن اختيار الأب ك ولي أمر وهو متوفي");
    }
    if(DeadMomTrigger && StudentResponsibleRelationSelect === "mother") {
        errors.push("لا يمكن اختيار الأم ك ولي أمر وهي متوفيه");
    }
    if (StudentResponsibleRelationSelect === "father") return {errors,ResData : ['father', {}]};
    if (StudentResponsibleRelationSelect === "mother") return {errors,ResData : ['mother', {}]};

    if (StudentResponsibleRelation.length === 0) {
        errors.push("يجب ادخال صله القرابه بين الطالب وولي الأمر");
    }

    if (ResName.length === 0 || ResAddress.length === 0 || ResAcademicDegree.length === 0) {
        errors.push("من فضلك ادخل جميع الحقول في بيانات ولي الأمر");
    }
    if (ResNationalId.length === 0 && ResPassportId.length === 0) {
        errors.push("يجب ادخال الرقم القومي او رقم الباسبورت لولي الأمر");
    }
    if (ResNationalId.length === 0) { ResNationalId = null; }
    if (ResPassportId.length === 0) { ResPassportId = null; }
    // hundle jobs 
    let jobs = [];
    for (let i = 0; i < ResWorkAreaChilds.length; i++) {
        const childs = ResWorkAreaChilds[i].children;
        let ParentJobId = childs[0].children[0].value;
        let ParentJobAddress = childs[1].children[0].children[1].value;
        if (ParentJobAddress === "") continue;
        jobs.push({
            ParentJobId,
            ParentJobAddress
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
                        ParentAcademicDegree: ResAcademicDegree
                    },
                    phones,
                    jobs
                }
            ]
        };
    } else {
        return {
            errors,
            data: null
        };
    }
}

//check absence data
const checkAddAbsenceData = () => {
    let errors = [];
    const AbsentDate = document.getElementById("AbsentDate").value;
    const AbsentReason = document.getElementById("AbsentReasons").value;
    if(AbsentReason.length === 0 || AbsentDate.length === 0){
        errors.push("من فضلك ادخل التاريخ وسبب الغياب لإضافه غياب جديد للطالب");
    }
    if(errors.length === 0) {
        return {
            errors : [],
            data : {
                AbsentReason,
                AbsentDate
            }
        }
    }else {
        return {
            errors,
            data : {}
        }
    }
}