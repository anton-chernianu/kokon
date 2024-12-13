// Core
import path from "path";
import fs from "fs";

async function combineFilesWithMarker(
  imagePath: string,
  archivePath: string,
  outputFilePath: string,
  marker: string,
) {
  try {
    const imageData = fs.readFileSync(imagePath);
    const archiveData = fs.readFileSync(archivePath);
    const markerBuffer = Buffer.from(marker);

    const combinedData = Buffer.concat([imageData, markerBuffer, archiveData]);
    fs.writeFileSync(outputFilePath, combinedData);

    console.log(`File: ${outputFilePath}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function extractFilesWithMarker(filePath: string, marker: string) {
  try {
    const data = fs.readFileSync(filePath);
    const markerBuffer = Buffer.from(marker);
    const markerIndex = data.indexOf(markerBuffer);

    if (markerIndex === -1) {
      console.error("Marker not found");
      return;
    }

    const imageData = data.slice(0, markerIndex);
    const archiveData = data.slice(markerIndex + markerBuffer.length);

    fs.writeFileSync("image.jpg", imageData);
    fs.writeFileSync("archive.rar", archiveData);

    console.log("Files extracted");
  } catch (error) {
    console.error("Error:", error);
  }
}

const imagePath = path.join(__dirname, "image.jpg");
const archivePath = path.join(__dirname, "archive.rar");
const outputFilePath = path.join(__dirname, "combined.jpg");
const marker = "_KoKoN_";

// combineFilesWithMarker(imagePath, archivePath, outputFilePath, marker);
// extractFilesWithMarker(outputFilePath, marker);
