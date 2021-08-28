const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Sequelize = require("sequelize");
const db = require("./config/db");
const sequelize = new Sequelize(db["development"]);
const Student = require("./db/models/student")(sequelize, Sequelize.DataTypes);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("login", function(event, args) {
  console.log(args);
  switch (args[0]) {
  case "1":
    if (args[1] === "1234"){
      mainWindow.loadFile(path.join(__dirname, "views/Expenses.html"));
    }
    break;
  case "2":
    if (args[1] === "2468"){
      mainWindow.loadFile(path.join(__dirname, "views/student-affairs.html"));
      Student.findAll()
        .then(res => res.map((r)=>r.toJSON())).then(console.log).catch(err => console.error(err));
    } else 
      break;  
  }
});