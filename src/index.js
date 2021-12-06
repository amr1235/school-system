const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const student = require("./queries/students");
const db = require("./db/models/index");
const { mapToJSON } = require("./queries/utlis");
const absent = require("./queries/absent");
const grade = require("./queries/grade");
const CLASS = require("./queries/class");
const parent = require("./queries/parent");
const payment = require("./queries/payment");
const installment = require("./queries/installment");
const { StartNewYear } = require("./queries/newYear");
const reports = require("./reports/reports");
const Bus = require("./queries/BusRoutes");
const seats = require("./queries/seats");
const { absenceSummary, classList } = require("./reports/affairs");
const fs = require("fs");
const url = require("url");
const { data } = require("jquery");
let CWD = process.cwd();

const rootDir = process.platform === "darwin" ? __dirname : CWD;

const jsreport = require("jsreport")({
  rootDirectory: rootDir
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "views/js/preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "views/login.html"));
  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// create dialog box for notifications
const DialogBox = (exports.DialogBox = (messages, type, title) => {
  let message = messages.join("\n");
  dialog.showMessageBox(mainWindow, {
    message: message,
    type,
    title,
  });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
const getEssentialData = async () => {
  let stagesData = await db["Stage"].findAll({
    attributes: ["StageId", "StageName"],
    include: {
      model: db["Grade"],
      attributes: ["GradeId", "GradeName"],
      include: [
        {
          model: db["Class"],
          attributes: ["ClassId", "ClassName"],
        },
        {
          model: db["Category"],
          attributes: ["CategoryName", "GradeId", "CategoryId"],
        },
      ],
    },
    order: [
      ["StageId", "ASC"],
      [db["Grade"], "GradeId", "ASC"],
      [db["Grade"], db["Class"], "ClassId", "ASC"],
    ],
  });
  stagesData = mapToJSON(stagesData);
  let stagesData2 = await db["Stage"].findAll({
    attributes: ["StageId", "StageName"],
    include: {
      model: db["Grade"],
      attributes: ["GradeId", "GradeName"],
      include: [
        {
          model: db["Class"],
          attributes: ["ClassId", "ClassName"],
        }
      ],
    },
    order: [
      ["StageId", "ASC"],
      [db["Grade"], "GradeId", "ASC"],
      [db["Grade"], db["Class"], "ClassId", "ASC"],
    ],
  });
  stagesData2 = mapToJSON(stagesData2);
  //get all jobs
  let jobs = await db["Job"].findAll();
  jobs = mapToJSON(jobs);
  // get all nationalities
  let nationalities = await db["Nationality"].findAll();
  nationalities = mapToJSON(nationalities);
  let students = await student.getAllStudents();
  return {
    stagesData,
    jobs,
    nationalities,
    students,
    stagesData2
  };
};
ipcMain.on("getAbsenceReport", async (err, { fromDate,
  toDate,
  StageId,
  GradeId,
  ClassId,
  absenceNumber }) => {
  
  if (StageId === "0") StageId = null;
  if (GradeId === "0") GradeId = null;
  if (ClassId === "0") ClassId = null;
  let rows = await absenceSummary(fromDate,toDate,absenceNumber,StageId,GradeId,ClassId);
  let title = "تقرير غياب";
  let r = [];
  let subHeaders = []; 
  for (let [key,value] of Object.entries(rows)) {
    subHeaders.push(key);
    r.push(value);
  }
  console.log(subHeaders);
  renderReport({title,rows:r,subHeaders});
});

async function renderReport(data, ) {
  try {
    // we defer jsreport initialization on first report render
    // to avoid slowing down the app at start time
    if (!jsreport._initialized) {
      await jsreport.init();
    }
    try {
      let cur = __dirname.split("\\");
      cur.pop();
      cur = cur.join("\\");
      const resp = await jsreport.render({
        template: {
          content: fs.readFileSync(path.join(__dirname, "./PDFAbsenceReport.html")).toString(),
          engine: "handlebars",
          recipe: "chrome-pdf"
        },
        data: {
          popper: cur + "/node_modules/@popperjs/core/dist/umd/popper.min.js",
          bootstrapjs: cur + "/node_modules/bootstrap/dist/js/bootstrap.min.js",
          bootstrapcss: cur + "/node_modules/bootstrap/dist/css/bootstrap.min.css",
          logo: cur + "/src/assets/images/index.png",
          rows: data.rows,
          subHeaders : data.subHeaders,
          title : data.title
        }
      });

      fs.writeFileSync(path.join(CWD, "report.pdf"), resp.content);

      const pdfWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
          plugins: true
        }
      });

      pdfWindow.loadURL(url.format({
        pathname: path.join(CWD, "report.pdf"),
        protocol: "file"
      }));

    } catch (e) {
      console.log(e);
      DialogBox(["error while rendering jsreport"], "error", "error while starting jsreport");
    }
  } catch (e) {
    DialogBox(["error while starting jsreport"], "error", "error while starting jsreport");
  }
}

// listen for dialogboxes
ipcMain.on("ShowDialogBox", (err, { messages, type, title }) => {
  DialogBox(messages, type, title);
});
//
ipcMain.on("PayBusInstallments", (err, { StudentId, payAmount }) => {
  payment
    .addBusPaymentAndUpdateInstallments(StudentId, payAmount)
    .then(() => {
      mainWindow.webContents.send("reload", null);
      DialogBox(["تم دفع الدفعة بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
    });
});
// update Bus Routes
ipcMain.on(
  "updateBusRoutes",
  (err, { goingtoBeUpdated, deletedRoutes, newRoutes }) => {
    Bus.updateBusRoutes(newRoutes, deletedRoutes, goingtoBeUpdated)
      .then(() => {
        mainWindow.webContents.send("reload", null);
        DialogBox(["تم تعديل الخطوط بنجاح"], "info", "تم");
      })
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
// subscribe To New Bus Route
ipcMain.on(
  "subscribeToNewBusRoute",
  (
    err,
    {
      StudentId,
      BusRouteId,
      newRouteCost,
      firstBusInstallmentPortion,
      IsFullRoute,
    },
  ) => {
    Bus.subscribeToNewBusRoute(
      StudentId,
      BusRouteId,
      newRouteCost,
      firstBusInstallmentPortion,
      IsFullRoute,
    )
      .then(() => {
        mainWindow.webContents.send("reload", null);
        DialogBox(["تم الأشتراك بنجاح"], "info", "تم");
      })
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
//Start New Year
ipcMain.on("StartNewYear", (err, allExpensesData) => {
  StartNewYear(allExpensesData)
    .then(() => {
      DialogBox(["تم بدء السنة الجديدة بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
    });
});
// add Payment And Update Installments
ipcMain.on(
  "addPaymentAndUpdateInstallments",
  (err, { StudentId, catsMoney }) => {
    payment
      .addCategoryPaymentAndUpdateInstallments(catsMoney, StudentId)
      .then(() => {
        mainWindow.webContents.send("reload", null);
        DialogBox(["تم اضافة المبلغ بنجاح"], "info", "تم");
      })
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
ipcMain.on(
  "PayFromLastYearInstallment",
  (err, { InstallmentId, newAmount }) => {
    installment
      .PayFromLastYearInstallment(InstallmentId, newAmount)
      .then(() => {
        mainWindow.webContents.send("reload", null);
        DialogBox(["تم اضافة المبلغ بنجاح"], "info", "تم");
      })
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
//add New Class
ipcMain.on("addNewClass", (err, GradeId) => {
  CLASS.addClass(GradeId)
    .then(() => {
      DialogBox(["تم إضافه الفصل بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ اثناء الإضافه برجاء المحاوله مجددا"], "error", "خطأ");
    });
});
ipcMain.on("addNewParentJob", (err, newParentJob) => {
  parent
    .addNewJob(newParentJob)
    .then(() => {
      DialogBox(["تم اضافة الوظيفة بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
    });
});

//addAbsentType
ipcMain.on("addAbsentType", (err, AbsentReasonName) => {
  absent
    .addAbsentReason(AbsentReasonName)
    .then(() => {
      DialogBox(["تم اضافة عذر غياب جديد"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
    });
});
// Generate Students Seats 
ipcMain.on("GenerateStudentsSeats", function (err, { gradeId, seatStart, seatStep }) {
  seats.generateStudentSeats(gradeId, seatStart, seatStep).then((results) => {
    console.log(results);
    DialogBox(["تم توليد الأرقام الجلوس"], "info", "تم");
  }).catch(err => {
    console.log(err);
    DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
  });
});
// ipcMain.on("render-pdf-report", () = {
  
// })
// get essintial Data
ipcMain.on("getEssentialData", function (err, destination) {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  if (destination === "affairsSettings") {
    grade
      .getGrades()
      .then((grades) => {
        getEssentialData().then((data) => {
          mainWindow.loadFile(path.join(__dirname, "views/affairsSettings.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", [grades, data]);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        });
      })
      .catch((err) => {
        console.log(err);
        DialogBox("حدث خطأ ما برجاء المحاولة مجددا", "error", "خطأ");
      });
  } else if (destination === "BusRouts") {
    // get student and all busRoutes
    student.getAllStudents().then((students) => {
      Bus.getBusRoutes().then((BusRoutes) => {
        mainWindow.loadFile(path.join(__dirname, "views/BusRoutes.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", {
            students,
            BusRoutes,
          });
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      });
    });
  }
  else if (destination === "studentsSeats") {
    grade.getGrades().then((grades) => {
      mainWindow.loadFile(
        path.join(__dirname, "views/Exams.html"),
      );
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("sentEssentialData", grades);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    });
  } else if (destination === "studentsAbsentReport") {
    getEssentialData().then((data) => {
      mainWindow.loadFile(path.join(__dirname, "views/AbsenceReportSettings.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("sentEssentialData", data.stagesData);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    });
  } else {
    // get all stages , grades and classes
    getEssentialData().then((data) => {
      console.log(data.stagesData.Grades);
      if (destination === "addStudent") {
        mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      } else if (destination === "affairsHome") {
        mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      } else if (destination === "Expenses") {
        mainWindow.loadFile(path.join(__dirname, "views/Expenses.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      } else if (destination === "ExpensesSettings") {
        grade.getGrades().then((grades) => {
          mainWindow.loadFile(
            path.join(__dirname, "views/ExpensesSettings.html"),
          );
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", {
              students: data.students,
              allGrades: grades,
            });
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        });
      }
    });
  }
});
// transferStudent
ipcMain.on("transferStudent", (err, { studentId, SchoolName }) => {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  student
    .transferStudent(studentId, SchoolName)
    .then(() => {
      student.getAllStudents().then((students) => {
        mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", students);
          DialogBox(["تم تحويل الطالب بنجاح"], "info", "تم");
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      student.getAllStudents().then((students) => {
        mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", students);
          DialogBox(
            ["حصل خلل اثناء التحويل الرجاء التاكد من البيانات وحاول مجددا"],
            "error",
            "خطأ",
          );
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      });
    });
});
ipcMain.on(
  "addNewStudentRequest",
  (err, { studentData, fatherData, motherData, resData }) => {
    mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
    student
      .addNewStudent(
        fatherData,
        motherData,
        resData,
        studentData.studentData,
        studentData.StudentClassId,
      )
      .then(() => {
        getEssentialData().then((data) => {
          mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", data);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
          DialogBox("تم تسجيل الطالب بنجاح", "info", "تم");
        });
      })
      .catch((err) => {
        console.log(err);
        getEssentialData().then((data) => {
          mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", data);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
          DialogBox(
            "حصل خطأ اثناء التسجيل برجاء التأكد من البيانات وحاول مجددا",
            "info",
            "تم",
          );
        });
      });
  },
);
// add Student Absent
ipcMain.on(
  "addStudentAbsent",
  function (err, { studentId, AbsentDate, AbsentReason }) {
    mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
    absent
      .addNewAbsenceDay(studentId, AbsentReason, AbsentDate)
      .then(() => {
        student
          .getStudentData(studentId)
          .then((data) => {
            student
              .getAllStudents()
              .then((students) => {
                data = {
                  ...data,
                  students,
                };
                mainWindow.loadFile(
                  path.join(__dirname, "views/updateStudent.html"),
                );
                ipcMain.on("ScriptLoaded", function cb() {
                  mainWindow.webContents.send("getStudentDataFromMain", data);
                  ipcMain.removeListener("ScriptLoaded", cb);
                });
              })
              .catch(console.log);
          })
          .catch(console.log);
      })
      .catch((err) => {
        console.log(err);
        student.getAllStudents().then((students) => {
          mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", students);
            DialogBox(
              [
                "حصل خلل اثناء اضافة الغياب الرجاء التاكد من البيانات وحاول مجددا",
              ],
              "error",
              "خطأ",
            );
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        });
      });
  },
);

// update absent reason
ipcMain.on(
  "updateStudentAbsent",
  (err, { studentId, absentDate, newReasonId }) => {
    absent
      .updateAbsenceReason(studentId, absentDate, newReasonId)
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
ipcMain.on("deleteStudentAbsent", (err, { studentId, absentDate }) => {
  absent.deleteAbsence(studentId, absentDate).catch((err) => {
    console.log(err);
    DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
  });
});
// update absent reason
ipcMain.on(
  "updateStudentAbsent",
  (err, { studentId, absentDate, newReasonId }) => {
    absent
      .updateAbsenceReason(studentId, absentDate, newReasonId)
      .catch((err) => {
        console.log(err);
        DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      });
  },
);
ipcMain.on("deleteStudentAbsent", (err, { studentId, absentDate }) => {
  absent.deleteAbsence(studentId, absentDate).catch((err) => {
    console.log(err);
    DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
  });
});
ipcMain.on("unSubscribeBusRoute", (err, { StudentId, unSubscribeFees }) => {
  Bus.unSubscribeBusRoute(StudentId, unSubscribeFees)
    .then(() => {
      mainWindow.webContents.send("reload", null);
      DialogBox(["تم الغاء الأشتراك بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox("حدث خطأ ما برجاء المحاولة مجددا", "error", "خطأ");
    });
});
// update student
ipcMain.on(
  "UpdateStudentData",
  function (err, { studentId, studentData, fatherData, motherData, resData }) {
    mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
    //update student
    // console.log(studentData);
    console.log(fatherData);
    student
      .updateStudentByStudentId(
        studentId,
        fatherData,
        motherData,
        resData,
        studentData.studentData,
        studentData.StudentClassId,
      )
      .then(() => {
        student
          .getStudentData(studentId)
          .then((data) => {
            student
              .getAllStudents()
              .then((students) => {
                data = {
                  ...data,
                  students,
                };
                mainWindow.loadFile(
                  path.join(__dirname, "views/updateStudent.html"),
                );
                ipcMain.on("ScriptLoaded", function cb() {
                  mainWindow.webContents.send("getStudentDataFromMain", data);
                  ipcMain.removeListener("ScriptLoaded", cb);
                });
              })
              .catch(console.log);
          })
          .catch(console.log);
      })
      .catch((err) => {
        console.log(err);
        student.getAllStudents().then((students) => {
          mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", students);
            DialogBox(
              [
                "حصل خلل اثناء تحديث البيانات الرجاء التاكد من البيانات وحاول مجددا",
              ],
              "error",
              "خطأ",
            );
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        });
      });
  },
);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
let CurrentWindow = null;
ipcMain.on("login", function (event, args) {
  console.log(args[0], args[1]);
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  // load Students
  switch (args[0]) {
  case "1":
    if (args[1] === "1234") {
      CurrentWindow = "expenses";
      getEssentialData().then((data) => {
        mainWindow.loadFile(path.join(__dirname, "views/Expenses.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      });
    } else {
      DialogBox(["تاكد من كلمة السر"], "error", "خطأ");
    }
    break;
  case "2":
    if (args[1] === "2468") {
      CurrentWindow = "affairs";
      getEssentialData().then((data) => {
        console.log(data);
        mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("sentEssentialData", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      });
    } else {
      DialogBox(["تاكد من كلمة السر"], "error", "خطأ");
    };
  }
});
ipcMain.on("sendStudentIdToMain", (err, studentId) => {
  // load screen
  student.getStudentData(Number(studentId)).then((data) => {
    student
      .getAllStudents()
      .then((students) => {
        data = {
          ...data,
          students,
        };
        if (CurrentWindow === "affairs") {
          mainWindow.loadFile(path.join(__dirname, "views/updateStudent.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("getStudentDataFromMain", data);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        } else {
          student.getFinancialData(studentId).then((finData) => {
            data = {
              ...data,
              financialData: {
                ...finData,
              },
            };
            mainWindow.loadFile(
              path.join(__dirname, "views/studentInstallments.html"),
            );
            ipcMain.on("ScriptLoaded", function cb() {
              mainWindow.webContents.send("getStudentDataFromMain", data);
              ipcMain.removeListener("ScriptLoaded", cb);
            });
          });
        }
      })
      .catch(console.log);
  });
});
ipcMain.on("receiveWarning", (err, { StudentId, WarningDate }) => {
  absent
    .receiveWarning(StudentId, WarningDate)
    .then(() => {
      mainWindow.webContents.send("reload", null);
      DialogBox(["تم تعديل الإنذار بنجاح"], "info", "تم");
    })
    .catch((err) => {
      console.log(err);
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
    });
});
ipcMain.on("sendAffairsReportData", (err, args) => {
  // load screen
  const ReportType = args[0];
  const params = args[1];
  reports["Affairs"][ReportType]["query"](...params)
    .then((results) => {
      let newWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
          nodeIntegration: false, // is default value after Electron v5
          contextIsolation: true, // protect against prototype pollution
          enableRemoteModule: false, // turn off remote
          preload: path.join(__dirname, "views/js/preload.js"),
        },
      });
      newWindow.loadFile(path.join(__dirname, "views/loading.html"));
      const data = {
        rows: results,
        title: reports["Affairs"][ReportType]["title"],
        headers: reports["Affairs"][ReportType]["headers"],
      };
      newWindow.loadFile(path.join(__dirname, "./views/ReportTemplate.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        newWindow.webContents.send("getReportDataFromMain", data);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    })
    .catch((err) => {
      DialogBox(["حدث خطأ برجاء المحاولة مجددا"], "error", "خطأ");
      console.error(err);
    });
});

ipcMain.on("sendExpansesReportData", (err, args) => {
  // load screen
  const ReportType = args[0];
  const params = args[1];
  let newWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "views/js/preload.js"),
    },
  });
  newWindow.loadFile(path.join(__dirname, "views/loading.html"));
  reports["Expanses"][ReportType]["query"](...params)
    .then((results) => {
      const data = {
        rows: results,
        title: reports["Expanses"][ReportType]["title"],
        headers: reports["Expanses"][ReportType]["headers"],
      };
      newWindow.loadFile(path.join(__dirname, "./views/ReportTemplate.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        newWindow.webContents.send("getReportDataFromMain", data);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    })
    .catch(console.log);
});
