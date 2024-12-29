// Core
import { app, BrowserWindow, ipcMain, dialog, nativeTheme, shell } from "electron";
import * as path from "path";
import * as fs from "fs";

// Workers
import { Worker } from "worker_threads";

// Utils
import { fromFile as fileTypeFromFile } from "file-type";
import { createExtractorFromFile } from "node-unrar-js";

// Set environment
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

  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: "detach",
    });
  }

  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "RAR Files", extensions: ["rar"] }],
    });
    return result.filePaths;
  });

  ipcMain.handle(
    "extract-rar",
    async (event, { filePath, password = "" }: { filePath: string; password?: string }) => {
      return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, "worker/extractor-worker.js");

        const worker = new Worker(workerPath, {
          workerData: { filePath, password },
        });

        worker.on("message", message => {
          if (message.error) {
            console.error("Worker error message:", message.error);
            resolve({ status: "error", message: message.error });
          } else if (message.done) {
            console.log("Extraction completed:", message.outputDir);
            resolve({
              status: "success",
              message: message.outputDir,
            });
          } else {
            console.log("Progress update:", message);
            event.sender.send("extract-progress", {
              processed: message.processed,
              total: message.total,
              currentFile: message.currentFile,
              nextFile: message.nextFile,
            });
          }
        });

        worker.on("error", error => {
          console.error("Worker encountered an error:", error);
          reject(error);
        });

        worker.on("exit", code => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    },
  );

  ipcMain.handle("file-list-rar", async (_, filePath: string) => {
    try {
      const outputDir = path.join(path.dirname(filePath), path.parse(filePath).name);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const extractor = await createExtractorFromFile({ filepath: filePath });

      const list = extractor.getFileList();
      const listArcHeader = list.arcHeader;
      const fileHeaders = [...list.fileHeaders];

      return {
        header: listArcHeader,
        files: fileHeaders,
      };
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  });

  ipcMain.handle("file:drag", async (_, filePath: string) => {
    const fileType = (await fileTypeFromFile(filePath))?.mime;

    return {
      type: fileType || "unknown",
      path: filePath,
    };
  });

  ipcMain.handle("open-directory", async (_, filePath: string) => {
    const folderPath = path.dirname(filePath);
    try {
      const isAccessible = fs.existsSync(folderPath);
      if (!isAccessible) {
        throw new Error("Directory does not exist");
      }
      await shell.openPath(filePath);
      return { success: true };
    } catch (error: any) {
      console.error("Error opening directory:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("get-system-theme", () => {
    return nativeTheme.shouldUseDarkColors ? "dark" : "light";
  });

  nativeTheme.on("updated", () => {
    mainWindow.webContents.send(
      "theme-updated",
      nativeTheme.shouldUseDarkColors ? "dark" : "light",
    );
  });
});
