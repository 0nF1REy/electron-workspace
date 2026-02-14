const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;
let aboutWindow;

// Janela principal
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: path.join(__dirname, "assets", "icons", "Icon_256x256.png"),
    resizable: isDev,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  // Mostrar DevTools automaticamente se estiver em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

// Janela "Sobre"
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: "About Electron",
    icon: path.join(__dirname, "assets", "icons", "Icon_256x256.png"),
  });
  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
  aboutWindow.on("closed", () => (aboutWindow = null));
}

// Quando o app estiver pronto, cria a janela
app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove variável da memória
  mainWindow.on("closed", () => (mainWindow = null));
});

// Template do menu
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "Sobre",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Ajuda",
          submenu: [
            {
              label: "Sobre",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    label: "Arquivo",
    submenu: [
      {
        label: "Sair",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+W",
      },
    ],
  },
  ...(isDev
    ? [
        {
          label: "Desenvolvedor",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// Responder ao evento de redimensionar imagem
ipcMain.on("image:resize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageresizer");
  resizeImage(options);
});

// Redimensionar e salvar imagem
async function resizeImage({ fileName, fileBuffer, height, width, dest }) {
  try {
    // Converter o objeto de buffer de volta para Buffer do Node.js
    const buffer = Buffer.from(fileBuffer);

    // Redimensionar imagem usando o Buffer
    const newPath = await resizeImg(buffer, {
      width: +width,
      height: +height,
    });

    // Usar o nome do arquivo enviado do renderer
    const newFilename = fileName;

    // Criar pasta de destino se não existir
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Escrever o arquivo na pasta de destino
    fs.writeFileSync(path.join(dest, newFilename), newPath);

    // Enviar sucesso para o renderer
    mainWindow.webContents.send("image:done");

    // Abrir a pasta no explorador de arquivos
    shell.openPath(dest);
  } catch (err) {
    console.error(err);
    mainWindow.webContents.send(
      "image:error",
      err.message || "Erro desconhecido ao redimensionar imagem."
    );
  }
}

// Sair quando todas as janelas forem fechadas
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

// Abrir uma janela se nenhuma estiver aberta (macOS)
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
