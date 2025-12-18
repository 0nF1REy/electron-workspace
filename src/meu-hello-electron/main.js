const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const MinhaJanela = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  MinhaJanela.loadFile('index.html');
  MinhaJanela.webContents.openDevTools();
}

app.whenReady().then(createWindow);