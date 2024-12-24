// Core
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const fileTypeUtils = require("file-type");
const { Worker } = require("worker_threads");

// Utils
const { createExtractorFromFile } = require("node-unrar-js");

// Constants
const isDev = !app.isPackaged;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 650,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
    titleBarStyle: "hidden",
    resizable: false,
    fullscreenable: false,
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(app.getAppPath(), "dist", "frontend", "index.html")}`;

  mainWindow.loadURL(startUrl);

  // if (isDev) {
  mainWindow.webContents.openDevTools({
    mode: "detach",
  });
  // }

  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "RAR Files", extensions: ["rar"] }],
    });
    return result.filePaths;
  });

  ipcMain.handle("extract-rar", async (event, { filePath, password = "" }) => {
    return new Promise((resolve, reject) => {
      const workerPath = isDev
        ? path.join(__dirname, "worker/extractor-worker.js")
        : path.join(process.resourcesPath, "worker", "extractor-worker.js");

      const worker = new Worker(workerPath, {
        workerData: { filePath, password },
      });

      worker.on("message", (message) => {
        if (message.error) {
          resolve({ status: "error", message: message.error });
        } else if (message.done) {
          resolve({
            status: "success",
            message: message.outputDir,
          });
        } else {
          event.sender.send("extract-progress", {
            processed: message.processed,
            total: message.total,
            currentFile: message.currentFile,
            nextFile: message.nextFile,
          });
        }
      });

      worker.on("error", (error) => {});
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  });

  ipcMain.handle("file-list-rar", async (_, filePath) => {
    try {
      const outputDir = path.join(path.dirname(filePath), path.parse(filePath).name);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const extractor = await createExtractorFromFile({
        filepath: filePath,
      });

      const list = extractor.getFileList();
      const listArcHeader = list.arcHeader;
      const fileHeaders = [...list.fileHeaders];

      return {
        header: listArcHeader,
        files: fileHeaders,
      };
    } catch (err) {
      return `Error: ${err.message}`;
    }
  });

  ipcMain.handle("file:drag", async (_, filePath) => {
    const fileType = (await fileTypeUtils.fromFile(filePath)).mime;

    return {
      type: fileType,
      path: filePath,
    };
  });
});
