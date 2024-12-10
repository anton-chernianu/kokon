import React, { useState } from "react";

function App() {
  const [filePath, setFilePath] = useState("");
  const [message, setMessage] = useState("");

  const handleSelectFile = async () => {
    const filePaths = await window.electronAPI.selectFile();
    if (filePaths.length > 0) {
      setFilePath(filePaths[0]);
    } else {
      setFilePath("No file selected.");
    }
  };

  const handleExtractFile = async () => {
    if (filePath) {
      const result = await window.electronAPI.extractFile(filePath);
      setMessage(result);
    }
  };

  return (
    <div>
      <p>v2</p>
      <h1>Select and Extract RAR File</h1>
      <button onClick={handleSelectFile}>Select File</button>
      {filePath && (
        <>
          <p>Selected file: {filePath}</p>
          <button onClick={handleExtractFile}>Extract File</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
