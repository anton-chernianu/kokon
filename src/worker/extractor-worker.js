// Core
const fs = require("fs");
const path = require("path");
const { parentPort, workerData } = require("worker_threads");

// Utils
const { createExtractorFromFile } = require("node-unrar-js");

(async () => {
  try {
    const { filePath, password } = workerData;

    const outputDir = path.join(path.dirname(filePath), path.parse(filePath).name);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const extractor = await createExtractorFromFile({
      filepath: filePath,
      targetPath: outputDir,
      password,
    });

    let extractedCount = 0;
    const fileHeadersArray = Array.from(extractor.getFileList().fileHeaders);

    const totalFiles = fileHeadersArray.length;

    for await (const file of extractor.extract().files) {
      const nextFile = fileHeadersArray[extractedCount + 1]?.name || "None";
      extractedCount += 1;

      parentPort.postMessage({
        processed: extractedCount,
        total: totalFiles,
        currentFile: file.fileHeader.name,
        nextFile: nextFile,
      });
    }

    parentPort.postMessage({ done: true, outputDir });
  } catch (error) {
    const errorStatuses = {
      "Error: Password for encrypted file or header is not specified": "PASSWORD_REQUIRED",
      "Error: Wrong password is specified": "WRONG_PASSWORD",
    };
    const errorStatus = errorStatuses[error] || error;

    parentPort.postMessage({ error: errorStatus });
  }
})();

process.on("uncaughtException", err => {
  parentPort.postMessage({ error: `Uncaught exception: ${err.message}` });
});

process.on("unhandledRejection", (reason, promise) => {
  parentPort.postMessage({ error: `Unhandled rejection: ${reason}` });
});
