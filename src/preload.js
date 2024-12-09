const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("dialog:openFile"),
  extractFile: (filePath) => ipcRenderer.invoke("extract-rar", filePath),
});
