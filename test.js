const { createExtractorFromFile } = require("node-unrar-js");

const testPath = "/Users/antony/Downloads/test.rar";

async function extractFiles() {
  try {
    const extractor = await createExtractorFromFile({ filepath: testPath, targetPath: "output" });

    const list = extractor.getFileList();

    const listArcHeader = list.arcHeader;

    const fileHeaders = [...list.fileHeaders];

    console.log(listArcHeader);

    // let fileCount = 0;
    //
    // for (const file of fileHeaders) {
    //     fileCount++;
    //     const fileName = file.name;
    //     console.log(fileName);
    // }
    //
    // const extracted = extractor.extract({ files: ["1.txt"] });
    //
    // console.log(`File count: ${fileCount}`);

    [...extractor.extract().files];

    // const fileGenerator = list.fileHeaders;
    //
    // for (const file of fileGenerator) {
    //     console.log(file);
    // }
  } catch (err) {
    console.error("Error extracting files:", err);
  }
}

extractFiles();
