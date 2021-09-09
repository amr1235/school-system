const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("#login");
  loginBtn.addEventListener("click", () => {
    console.log("test");
    const password = document.querySelector("#password").value;
    const department = document.querySelector("#dep").value;
    ipcRenderer.send("login", [department, password]);
  });
});