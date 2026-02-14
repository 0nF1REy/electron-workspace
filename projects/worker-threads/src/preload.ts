import { contextBridge, ipcRenderer } from "electron";

const renderer = {
  start_heavy_counter: () => {
    ipcRenderer.send("start_heavy_counter");
  },
  start_heavy_worker_counter: () => {
    ipcRenderer.send("start_heavy_worker_counter");
  },
};

contextBridge.exposeInMainWorld("electron", renderer);

export type TRenderer = typeof renderer;
