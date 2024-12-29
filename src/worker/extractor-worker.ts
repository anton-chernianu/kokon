// Core
import * as fs from "fs";
import * as path from "path";
import { parentPort, workerData } from "worker_threads";

// Utils
import { createExtractorFromFile } from "node-unrar-js";

(async () => {
  try {
    const { filePath, password }: { filePath: string; password?: string } = workerData;

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

      parentPort?.postMessage({
        processed: extractedCount,
        total: totalFiles,
        currentFile: file.fileHeader.name,
        nextFile: nextFile,
      });
    }

    parentPort?.postMessage({ done: true, outputDir });
  } catch (error: any) {
    const errorStatuses: { [key: string]: string } = {
      "Password for encrypted file or header is not specified": "PASSWORD_REQUIRED",
      "Wrong password is specified": "WRONG_PASSWORD",
    };
    const errorStatus = errorStatuses[error.message] || error.message;

    console.log(errorStatus, "errorStatus");

    parentPort?.postMessage({ error: errorStatus });
  }
})();

process.on("uncaughtException", (err: Error) => {
  parentPort?.postMessage({ error: `Uncaught exception: ${err.message}` });
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  parentPort?.postMessage({ error: `Unhandled rejection: ${reason}` });
});
