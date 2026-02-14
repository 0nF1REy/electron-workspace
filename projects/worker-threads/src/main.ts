import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { Worker } from "node:worker_threads";

if (started) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("start_heavy_counter", () => {
  let counter = 0;
  while (counter < 500000) {
    console.log(counter);
    counter++;
  }
});

ipcMain.on("start_heavy_worker_counter", () => {
  const workerPath = path.join(__dirname, "counter.worker.js");

  const worker = new Worker(workerPath, {
    workerData: { testData: "hello world" },
  });

  worker.on("message", (msg) => console.log("Resultado do Worker:", msg));
  worker.on("error", (err) => console.error("Erro no Worker:", err));
  worker.on("exit", (code) =>
    console.log("Worker finalizado com código:", code)
  );
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
