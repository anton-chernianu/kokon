const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { createExtractorFromFile } = require("node-unrar-js");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadFile("index.html");
});

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

    const extractor = await createExtractorFromFile({ filepath: filePath, targetPath: outputDir });

    [...extractor.extract().files];

    return `Files extracted to: ${outputDir}`;

    // const list = extractor.getFileList();
    //
    // const fileGenerator = list.fileHeaders;
    //
    // for (const file of fileGenerator) {
    //     console.log(file);
    // }
  } catch (err) {
    return `Error: ${err.message}`;
  }
});
