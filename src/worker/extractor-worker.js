// Core
const fs = require("fs");
const path = require("path");
const { parentPort, workerData } = require("worker_threads");
const { createExtractorFromFile } = require("node-unrar-js");

// Utils

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

    const fileHeadersArray = Array.from(extractor.getFileList().fileHeaders);

    const totalFiles = fileHeadersArray.length;

    let extractedCount = 0;

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
    };
    const errorStatus = errorStatuses[error] || error;

    parentPort.postMessage({ error: errorStatus });
  }
})();
