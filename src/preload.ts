import { contextBridge, ipcRenderer, webUtils } from "electron";

interface ElectronAPI {
  selectFile: () => Promise<string[]>;
  filesList: (filePath: string) => Promise<any>;
  extractFile: (props: { filePath: string; password?: string }) => Promise<any>;
  startDrag: (file: File) => Promise<any>;
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
  openDirectory: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  getSystemTheme: () => Promise<string>;
}

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: (): Promise<string[]> => ipcRenderer.invoke("dialog:openFile"),

  filesList: (filePath: string): Promise<any> => ipcRenderer.invoke("file-list-rar", filePath),

  extractFile: ({ filePath, password }: { filePath: string; password?: string }): Promise<any> => {
    return ipcRenderer.invoke("extract-rar", { filePath, password });
  },

  startDrag: async (file: File): Promise<any> => {
    const path = webUtils.getPathForFile(file);
    return ipcRenderer.invoke("file:drag", path);
  },

  on: (channel: string, callback: (...args: any[]) => void): void => {
    const validChannels = ["extract-progress"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },

  removeListener: (channel: string, callback: (...args: any[]) => void): void => {
    ipcRenderer.removeListener(channel, callback);
  },

  openDirectory: (filePath: string): Promise<{ success: boolean; error?: string }> => {
    return ipcRenderer.invoke("open-directory", filePath);
  },

  getSystemTheme: (): Promise<string> => {
    return ipcRenderer.invoke("get-system-theme");
  },
} as ElectronAPI);
