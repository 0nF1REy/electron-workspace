import { contextBridge, ipcRenderer } from "electron";

const api = {
  addTask: (title) => ipcRenderer.invoke("tasks:add", title),
  deleteTask: (id) => ipcRenderer.invoke("tasks:delete", id),
  markComplete: (params) => ipcRenderer.invoke("tasks:markComplete", params),
  getAllTasks: () => ipcRenderer.invoke("tasks:getAll"),
};

contextBridge.exposeInMainWorld("api", api);
