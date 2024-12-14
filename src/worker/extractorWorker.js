const { parentPort, workerData } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { createExtractorFromFile } = require("node-unrar-js");

(async () => {
  try {
    const { filePath } = workerData;

    const outputDir = path.join(path.dirname(filePath), path.parse(filePath).name);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const extractor = await createExtractorFromFile({
      filepath: filePath,
      targetPath: outputDir,
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
    parentPort.postMessage({ error: error.message });
  }
})();
