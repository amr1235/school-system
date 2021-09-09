// const { ipcRenderer } = require("electron");

const loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", () => {
  console.log("clicked");
//   ipcRenderer.send("login", "Expanses");
});