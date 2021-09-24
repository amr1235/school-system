const { contextBridge, ipcRenderer } = require("electron");
// const student = require("../../queries/students");
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = [
      "sendStudentIdToMain",
      "ScriptLoaded",
      "UpdateStudentData",
      "getEssentialData",
      "addNewStudentRequest",
      "addStudentAbsentfeedBackMessages",
      "updateStudentAbsent",
      "deleteStudentAbsent",
      "sendAffairsReportData",
      "feedBackMessages",
      "addStudentAbsent",
      "updateStudentAbsent",
      "deleteStudentAbsent",
      "transferStudent",
      "ShowDialogBox",
      "addNewClass",
      "addNewParentJob",
      "addAbsentType",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "getStudentDataFromMain",
      "sentEssentialData",
      "getReportDataFromMain",
    ];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#login");
  loginBtn.addEventListener("click", () => {
    console.log("test");
    const password = document.querySelector("#password").value;
    const department = document.querySelector("#dep").value;
    ipcRenderer.send("login", [department, password]);
  });
});
