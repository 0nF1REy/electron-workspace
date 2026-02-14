import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { initDB } from "./database/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function setupAutoReload() {
  if (process.env.NODE_ENV === "development") {
    try {
      const { default: electronReload } = await import("electron-reload");
      electronReload(__dirname, {
        electron: path.join(__dirname, "node_modules", ".bin", "electron"),
        hardResetMethod: "exit",
        ignore: /node_modules|[\/\\]\./,
      });
      console.log("Auto-reload ativado");
    } catch (error) {
      console.log("electron-reload não disponível:", error.message);
    }
  }
}

async function createWindow() {
  try {
    db = await initDB();
    console.log("Banco de dados inicializado com sucesso");

    const win = new BrowserWindow({
      width: 800,
      height: 500,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    // Abre DevTools em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      win.webContents.openDevTools();
    }

    win.loadFile(path.join(__dirname, "renderer/index.html"));
  } catch (error) {
    console.error("Erro ao criar a janela:", error);
  }
}

app.whenReady().then(async () => {
  await setupAutoReload();
  await createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC para o renderer
ipcMain.handle("db-query", async (event, sql, params = []) => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const stmt = await db.prepare(sql);
    const result = sql.trim().toLowerCase().startsWith("select")
      ? await stmt.all(params)
      : await stmt.run(params);
    await stmt.finalize();

    return result;
  } catch (err) {
    console.error("Erro na consulta ao banco de dados:", err);
    return { error: err.message };
  }
});
