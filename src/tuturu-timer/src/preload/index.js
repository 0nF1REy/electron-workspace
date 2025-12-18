import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// APIs personalizadas para o renderer
const api = {}

// Use as APIs do `contextBridge` para expor as APIs do Electron
// ao renderer apenas se o isolamento de contexto estiver ativado, caso contrário
// adicione diretamente ao escopo global do DOM.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
