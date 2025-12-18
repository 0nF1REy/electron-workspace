const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  title: "Meu Aplicativo de Anotações",
  createNote: (data) => ipcRenderer.invoke("create-file", data),
});
