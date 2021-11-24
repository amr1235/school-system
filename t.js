const db = require("./src/db/models/index");
const { Op } = require("sequelize");
const { addNewStudent } = require("./src/queries/students")
const { readFile } = require("fs");
const { sequelize } = require("./src/db/models/index");

const dataBaseSetUp = async () => {
    return db.sequelize.transaction(async (t) => {
        await db["Stage"].bulkCreate([{ StageName: 'المرحله الإعدادية' }, { StageName: 'المرحلة الإبتدائية' }], {
            transaction: t
        });
        grades = [
            {
                StageId: 2,
                GradeName: 'أولى ابتدائي'
            },
            {
                StageId: 2,
                GradeName: 'ثانية أبتدائي'
            },
            {
                StageId: 2,
                GradeName: 'الثالث الإبتدائي'
            },
            {
                StageId: 2,
                GradeName: 'الرابع الإبتدائي'
            },
            {
                StageId: 2,
                GradeName: 'الخامس الإبتدائي'
            },
            {
                StageId: 2,
                GradeName: 'السادس الإبتدائي'
            },
            {
                StageId: 1,
                GradeName: 'أولى إعدادي'
            },
            {
                StageId: 1,
                GradeName: 'الثاني الإعدادي'
            },
            {
                StageId: 1,
                GradeName: 'الثالث الإعدادي'
            }
        ];
        await db["Grade"].bulkCreate(grades, { transaction: t });
        let classes = [];
        for (let i = 1; i <= 6; i++) {
            for (let j = 1; j <= 4; j++) {
                classes.push({
                    GradeId: i,
                    ClassName: String(i) + "/" + String(j)
                });
            }
        }
        for (let i = 7; i <= 9; i++) {
            for (let j = 1; j <= 3; j++) {
                classes.push({
                    GradeId: i,
                    ClassName: String(i - 6) + "/" + String(j)
                });
            }
        }
        await db["Class"].bulkCreate(classes, { transaction: t });
    });
};
// dataBaseSetUp();
const readFileAndGetStudents = async () => {
    return new Promise((res, rej) => {
        readFile("data/finalStudentData 2.csv", { encoding: 'utf-8' }, async (err, data) => {
            let students = [];
            let lines = data.split("\r\n");
            let header = lines[0].split(";");
            for (let i = 1; i < lines.length; i++) {
                let line = lines[i].split(";");
                let obj = {};
                for (let j = 0; j < header.length; j++) {
                    const head = header[j];
                    obj[head] = line[j];
                }
                students.push(obj);
            }
            // add jobs
            let finalJobs = [];
            let fatherJobs = students.map(std => std['Table1.father_job']);
            let motherJobs = students.map(std => std['Table1.mother_job']);
            let jobs = new Set(fatherJobs.concat(motherJobs));
            jobs.forEach(job => {
                if (job) {
                    finalJobs.push({
                        JobName: job
                    });
                }
            });
            finalJobs.push({
                JobName: "بلا عمل"
            });
            await db["Job"].bulkCreate(finalJobs).then(d => console.log("jobs added"));
            await db["Nationality"].create({
                NationalityName: "مصري"
            });
            res(students);
        });
    });
};
const generateId = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};
const addStudents = async (students) => {
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        let motherData = { ParentData: {} };
        let fatherData = { ParentData: {} };
        let resData = { ParentData: {} };
        let studentData = {};
        // student Data
        let currentDate = null;
        let birthDate = null;
        currentDate = new Date();
        currentDate = currentDate.toISOString();
        if(!student["student_national_id"]){
            
        }
        birthDate = getBirthDate(student["student_national_id"]);

        studentData.StudentNationalId = student["student_national_id"];
        studentData.StudentName = student["name"];
        studentData.StudentBirthDate = birthDate;
        studentData.StudentBirthDate = birthDate;
        studentData.StudentRegisterDate = currentDate;
        studentData.StudentAddress = student["Table1.student_address"];
        studentData.StudentSex = "MALE";
        studentData.StudentReligion = "MUSLIM";
        studentData.StudentNationalityId = 1;
        studentData.StudentSiblingOrder = 0;
        studentData.StudentFamilyStatus = "غير معروف";
        studentData.StudentHealth = "غير معروف";
        studentData.StudentExitDate = null;
        // add motherData 
        motherData.ParentData.ParentName = student["Table1.student_mother"];
        motherData.ParentData.ParentAddress = student["Table1.student_address"];
        motherData.ParentData.ParentAcademicDegree = "بدون مؤهل";
        motherData.ParentData.ParentNationalityId = 1;
        // add mother job 
        if (student["Table1.mother_job"] === "") {
            let job = await db["Job"].findOne({
                where: {
                    JobName: "بلا عمل"
                }
            }).then(res => res.toJSON());
            motherData.jobs = [{
                ParentJobId: job.JobId,
                ParentJobAddress: "غير معروف"
            }];
        } else {
            let job = await db["Job"].findOne({
                where: {
                    JobName: student["Table1.mother_job"]
                }
            }).then(res => res.toJSON());
            motherData.jobs = [{
                ParentJobId: job.JobId,
                ParentJobAddress: "غير معروف"
            }];
        }
        // add father job
        if (student["Table1.father_job"] === "") {
            let job = await db["Job"].findOne({
                where: {
                    JobName: "بلا عمل"
                }
            }).then(res => res.toJSON());
            fatherData.jobs = [{
                ParentJobId: job.JobId,
                ParentJobAddress: "غير معروف"
            }];
        } else {
            let job = await db["Job"].findOne({
                where: {
                    JobName: student["Table1.father_job"]
                }
            }).then(res => res.toJSON());
            fatherData.jobs = [{
                ParentJobId: job.JobId,
                ParentJobAddress: "غير معروف"
            }];
        }
        // add father data 
        fatherData.ParentData.ParentName = student["Table1.student_father_name"];
        fatherData.ParentData.ParentAddress = student["Table1.student_fath_address"];
        fatherData.ParentData.ParentAcademicDegree = "بدون مؤهل";
        fatherData.ParentData.ParentNationalityId = 1;
        if (student["Table1.link_name"] === "father") {
            // add parent phones 
            // if(student["resp_national_id"] === "") {
            //     fatherData.ParentData.ParentNationalId =  null;
            //     console.log("");
            // }else {
            //     fatherData.ParentData.ParentNationalId =  student["resp_national_id"];
            // }
            fatherData.ParentData.ParentNationalId = student["resp_national_id"] || null;
            motherData.ParentData.ParentNationalId = null;
            fatherData.phones = [student["Table1.student_resp_mobile"]];
            motherData.phones = ["0000000000"];
            resData[0] = "father";
            resData[1] = {};
        } else if (student["Table1.link_name"] === "mother") {
            // if(student["resp_national_id"] === ""){
            //     motherData.ParentData.ParentNationalId = null;
            //     console.log("");
            // }else {
            //     motherData.ParentData.ParentNationalId = student["resp_national_id"];
            // }
            motherData.ParentData.ParentNationalId = student["resp_national_id"] || null;
            fatherData.ParentData.ParentNationalId = null;
            motherData.phones = [student["Table1.student_resp_mobile"]];
            fatherData.phones = ["0000000000"];
            resData[0] = "father";
            resData[1] = {};
        } else {
            let d = {};
            d.ParentData.ParentName = student["Table1.student_responsable"];
            d.ParentData.ParentAddress = student["Table1.student_resp_address"];
            d.ParentData.ParentAcademicDegree = "بدون مؤهل";
            d.ParentData.ParentNationalityId = 1;
            d.ParentData.ParentNationalId = student["resp_national_id"] || null;
            d.phones = [student["Table1.student_resp_mobile"]];
            if (student["Table1.resp-job"] === "") {
                let job = await db["Job"].findOne({
                    where: {
                        JobName: "بلا عمل"
                    }
                }).then(res => res.toJSON());
                d.jobs = [{
                    ParentJobId: job.JobId,
                    ParentJobAddress: "غير معروف"
                }];
            } else {
                let job = await db["Job"].findOne({
                    where: {
                        JobName: student["Table1.mother_job"]
                    }
                }).then(res => res.toJSON());
                d.jobs = [{
                    ParentJobId: job.JobId,
                    ParentJobAddress: "غير معروف"
                }];
            }
            resData[0] = student["Table1.link_name"];
            resData[1] = d;
        }
        await addNewStudent(fatherData, motherData, resData, studentData, student["Table1.clase_name"]);
    }
    return 1;
};
const getBirthDate = (national_id) => {
    let year = "20" + national_id.substr(1, 2);
    let mouth = national_id.substr(3, 2);
    let day = national_id.substr(5, 2);
    let birthDate = new Date(year, mouth, day);
    birthDate = birthDate.toISOString();
    return birthDate
}
const dataBase = async () => {
    // data base set up 
    await dataBaseSetUp().catch(err => console.log("error"));
    // get students 
    let students = await readFileAndGetStudents();
    addStudents(students);
};
dataBase().then(res => console.log("data addes"));
