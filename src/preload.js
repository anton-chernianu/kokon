const { contextBridge, ipcRenderer, webFrame, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("dialog:openFile"),
  filesList: (filePath) => ipcRenderer.invoke("file-list-rar", filePath),
  extractFile: (filePath) => ipcRenderer.invoke("extract-rar", filePath),
  startDrag: async (file) => {
    const path = webUtils.getPathForFile(file);
    return ipcRenderer.invoke("file:drag", path);
  },
  on: (channel, callback) => {
    const validChannels = ["extract-progress"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
});
