const { app, screen, desktopCapturer, shell, Tray, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");

let tray;

// Retorna o ícone correto dependendo do sistema operacional
function getTrayIconPath() {
  if (process.platform === "win32")
    return path.join(__dirname, "assets/capture.ico");
  if (process.platform === "darwin")
    return path.join(__dirname, "assets/capture.icns");
  return path.join(__dirname, "assets/capture.png");
}

// Função para capturar a tela
function captureScreen() {
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: { width: screenSize.width, height: screenSize.height },
    })
    .then((sources) => {
      const img = sources[0].thumbnail.toPNG();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `screenshot-${timestamp}.png`;
      const filePath = path.join(os.homedir(), fileName);

      fs.writeFile(filePath, img, (err) => {
        if (!err) shell.openExternal(`file://${filePath}`);
      });
    });
}

// Cria o tray e define ações
function createTray() {
  tray = new Tray(getTrayIconPath());

  // Clique direto para capturar a tela
  tray.on("click", captureScreen);

  // Menu de contexto do tray
  const contextMenu = Menu.buildFromTemplate([
    { label: "Sair", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
}

// Inicializa app
app.whenReady().then(createTray);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!tray) createTray();
});
