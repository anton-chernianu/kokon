// Core
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

// Utils
const { createExtractorFromFile } = require("node-unrar-js");

// Constants
const isDev = !app.isPackaged;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 480,

    // width: 900,
    // height: 900,

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
  //   mainWindow.webContents.openDevTools();
  // }

  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "RAR Files", extensions: ["rar"] }],
    });
    return result.filePaths;
  });

  ipcMain.handle("extract-rar", async (_, filePath) => {
    try {
      const outputDir = path.join(path.dirname(filePath), path.basename(filePath, ".rar"));

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const extractor = await createExtractorFromFile({
        filepath: filePath,
        targetPath: outputDir,
      });

      [...extractor.extract().files];

      return `Files extracted to: ${outputDir}`;
    } catch (err) {
      return `Error: ${err.message}`;
    }
  });

  ipcMain.handle("file:drag", async (_, filePath) => {
    console.log(filePath);
    return filePath;
  });
});
