const { contextBridge, ipcRenderer, webFrame, webUtils } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("dialog:openFile"),
  filesList: filePath => ipcRenderer.invoke("file-list-rar", filePath),
  extractFile: props => {
    const { filePath, password } = props;
    return ipcRenderer.invoke("extract-rar", { filePath, password });
  },
  startDrag: async file => {
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
  openDirectory: filePath => ipcRenderer.invoke("open-directory", filePath),
  getSystemTheme: () => ipcRenderer.invoke("get-system-theme"),
});
