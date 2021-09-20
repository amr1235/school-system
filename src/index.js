const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const student = require("./queries/students");
const db = require("./db/models/index");
const { mapToJSON } = require("./queries/utlis");
const absent = require("./queries/absent");
// Enable live reload for Electron too
require("electron-reload")(__dirname, {
  electron: require("../node_modules/electron")
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
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
      preload: path.join(__dirname, "views/js/preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "views/login.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

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
      include: {
        model: db["Class"],
        attributes: ["ClassId"]
      }
    }
  });
  stagesData = mapToJSON(stagesData);
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
    students
  };
}
// get essintial Data 
ipcMain.on("getEssentialData", function (err, destination) {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  // get all stages , grades and classes
  getEssentialData().then(data => {
    if (destination === "addStudent") {
      mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("sentEssentialData", data);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    } else if (destination === "affairsHome") {
      mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("sentEssentialData", data.students);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    }
  });

});

ipcMain.on("addNewStudentRequest", (err, { studentData, fatherData, motherData, resData }) => {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  student.addNewStudent(fatherData, motherData, resData, studentData.studentData,
    studentData.StudentClassId).then(() => {
      mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("feedBackMessages", "تم تسجيل الطالب بنجاح");
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    }).catch(err => {
      console.log(err);
      mainWindow.loadFile(path.join(__dirname, "views/addNewStudent.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("feedBackMessages", " حدث خطأ اثناء الأدخال برجاء مراجعه البيانات وحاول مجددا");
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    });
});
// add Student Absent
ipcMain.on("addStudentAbsent", function (err, { studentId, AbsentDate, AbsentReason }) {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  absent.addNewAbsenceDay(studentId, AbsentReason, AbsentDate).then(() => {
    student.getStudentData(studentId).then(data => {
      student.getAllStudents().then(students => {
        data = {
          ...data,
          students
        }
        mainWindow.loadFile(path.join(__dirname, "views/updateStudent.html"));
        ipcMain.on("ScriptLoaded", function cb() {
          mainWindow.webContents.send("getStudentDataFromMain", data);
          ipcMain.removeListener("ScriptLoaded", cb);
        });
      }).catch(console.log);
    }).catch(console.log);
  }).catch(console.log);
});
// update absent reason 
ipcMain.on("updateStudentAbsent",(err,{studentId,absentDate,newReasonId}) => {
  absent.updateAbsenceReason(studentId,absentDate,newReasonId).catch(console.log);
});
ipcMain.on("deleteStudentAbsent",(err,{studentId,absentDate}) => {
  absent.deleteAbsence(studentId,absentDate).catch(console.log);
})
// update student 
ipcMain.on("UpdateStudentData", function (err, { studentId, studentData, fatherData, motherData, resData }) {
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  //update student
  student.updateStudentByStudentId(studentId, fatherData, motherData, resData, studentData.studentData,
    studentData.StudentClassId).then(() => {
      student.getStudentData(studentId).then(data => {
        student.getAllStudents().then(students => {
          data = {
            ...data,
            students
          }
          mainWindow.loadFile(path.join(__dirname, "views/updateStudent.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("getStudentDataFromMain", data);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        }).catch(console.log);
      }).catch(console.log);
    }).catch(err => {
      alert(err);
    });
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on("login", function (event, args) {
  console.log(args[0], args[1]);
  // load Students 
  switch (args[0]) {
    case "1":
      if (args[1] === "1234") {
        mainWindow.loadFile(path.join(__dirname, "views/Expenses.html"));
      }
      break;
    case "2":
      if (args[1] === "2468") {
        student.getAllStudents().then(students => {
          mainWindow.loadFile(path.join(__dirname, "views/affairsHome.html"));
          ipcMain.on("ScriptLoaded", function cb() {
            mainWindow.webContents.send("sentEssentialData", students);
            ipcMain.removeListener("ScriptLoaded", cb);
          });
        });
      } else
        break;
  }
});
ipcMain.on("sendStudentIdToMain", (err, studentId) => {
  // load screen
  mainWindow.loadFile(path.join(__dirname, "views/loading.html"));
  student.getStudentData(Number(studentId)).then(data => {
    student.getAllStudents().then(students => {
      data = {
        ...data,
        students
      }
      mainWindow.loadFile(path.join(__dirname, "views/updateStudent.html"));
      ipcMain.on("ScriptLoaded", function cb() {
        mainWindow.webContents.send("getStudentDataFromMain", data);
        ipcMain.removeListener("ScriptLoaded", cb);
      });
    }).catch(console.log);
  });
});