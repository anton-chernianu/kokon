import path from "path";
import fs from "fs";

class FileCombiner {
  private readonly marker: string;

  constructor(marker: string) {
    this.marker = marker;
  }

  public combineFiles(
      imagePath: string,
      archivePath: string,
      outputFilePath: string
  ): void {
    try {
      const imageData = fs.readFileSync(imagePath);
      const archiveData = fs.readFileSync(archivePath);
      const markerBuffer = Buffer.from(this.marker);

      const combinedData = Buffer.concat([imageData, markerBuffer, archiveData]);
      fs.writeFileSync(outputFilePath, combinedData);

      console.log(`File combined and saved to: ${outputFilePath}`);
    } catch (error) {
      console.error("Error combining files:", error);
    }
  }

  public extractFiles(filePath: string): void {
    try {
      const data = fs.readFileSync(filePath);
      const markerBuffer = Buffer.from(this.marker);
      const markerIndex = data.indexOf(markerBuffer);

      if (markerIndex === -1) {
        console.error("Marker not found in the file.");
        return;
      }

      const imageData = data.slice(0, markerIndex);
      const archiveData = data.slice(markerIndex + markerBuffer.length);

      fs.writeFileSync("image_extracted.jpg", imageData);
      fs.writeFileSync("archive_extracted.rar", archiveData);

      console.log("Files successfully extracted.");
    } catch (error) {
      console.error("Error extracting files:", error);
    }
  }
}

// Usage
const imagePath = path.join(__dirname, "image.jpg");
const archivePath = path.join(__dirname, "archive.rar");
const outputFilePath = path.join(__dirname, "combined.jpg");
const marker = "_KoKoN_";

const fileCombiner = new FileCombiner(marker);

// // Combine files
// fileCombiner.combineFiles(imagePath, archivePath, outputFilePath);
//
// // Extract files
// fileCombiner.extractFiles(outputFilePath);
