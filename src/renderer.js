document.getElementById("selectFileBtn").addEventListener("click", async () => {
  const filePaths = await window.electronAPI.selectFile();
  const filePathElem = document.getElementById("filePath");

  if (filePaths.length > 0) {
    const filePath = filePaths[0];
    filePathElem.innerText = `Selected file: ${filePath}`;

    const extractButton = document.getElementById("extractFileBtn");
    extractButton.style.display = "inline";
    extractButton.onclick = async () => {
      const result = await window.electronAPI.extractFile(filePath);
      filePathElem.innerText = result;
    };
  } else {
    filePathElem.innerText = "No file selected.";
  }
});
