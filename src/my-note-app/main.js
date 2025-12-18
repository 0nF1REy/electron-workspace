const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("create-file", (req, data) => {
    if (!data || !data.title || !data.content) return false;

    const notesDir = path.join(__dirname, "notes");

    // Cria a pasta se não existir
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir, { recursive: true });
    }

    const filePath = path.join(notesDir, `${data.title}.txt`);
    fs.writeFileSync(filePath, data.content);

    return { success: true, filePath };
  });

  win.loadFile("src/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
