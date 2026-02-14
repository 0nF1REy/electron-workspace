// Exportação de um objeto vazio para garantir que o arquivo seja tratado como um módulo
export {}

// Estende a interface global Window
declare global {
  interface Window {
    // Definição da propriedade 'electron'
    electron: {
      ipcRenderer: {
        // Adição de um ouvinte para um canal IPC.
        on: (channel: string, listener: (...args: any[]) => void) => void

        // Remoção todos os ouvintes de um canal IPC.
        removeAllListeners: (channel: string) => void
      }
    }
  }
}
