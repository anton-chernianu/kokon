const { contextBridge, ipcRenderer, webFrame, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("dialog:openFile"),
  extractFile: (filePath) => ipcRenderer.invoke("extract-rar", filePath),
  startDrag: (file) => {
    const path = webUtils.getPathForFile(file);
    return ipcRenderer.invoke("file:drag", path);
  }
});
