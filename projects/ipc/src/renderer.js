const chrome = document.getElementById("chrome");
const node = document.getElementById("node");
const electron = document.getElementById("electron");
const appPath = document.getElementById("app-path");
const inputArea = document.getElementById("input-area");
const submitButton = document.getElementById("url-submit");

chrome.innerHTML += " " + versions.chrome();
node.innerHTML += " " + versions.node();
electron.innerHTML += " " + versions.electron();

submitButton.addEventListener("click", () => {
  const url = inputArea.value;
  if (url.trim() !== "") {
    openNewWindow.openUrl(url);
  }
});

const fileSelector = document.getElementById("file-select");
const filePath = document.getElementById("file-path");

fileSelector.addEventListener("click", async () => {
  const path = await openFileApi.openFile();
  filePath.innerHTML += path;
});
