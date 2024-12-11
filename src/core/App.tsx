// Core
import React, { useState } from "react";

// Components
import { Toolbar } from "./components/Toolbar";
import { Menu } from "./components/Menu";
import { Drop } from "./components/Drop";

// Styles
import "../assets/app.scss";

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

  const handleRemoveFile = async () => {
    setFilePath("");
  };

  const handleFileDrop = async (path: string) => {
    console.log(path, 'handleFileDrop');
  }

  return (
    <div className={"app"}>
      <div className={"app__toolbar"}>
        <Toolbar />
      </div>
      <div className={"app__content"}>
        <div className={"app__menu"}>
          <Menu
              onSelect={handleSelectFile}
              onExtract={handleExtractFile}
              onRemove={handleRemoveFile}
          />
        </div>
        <div className={"app__filepath"}>

        </div>
        <div className={"app__drop"}>
          <Drop onFileDrop={handleFileDrop}/>
        </div>

        {/*<h1>Select and Extract RAR File</h1>*/}
        {/*<button onClick={handleSelectFile}>Select File</button>*/}
        {/*{filePath && (*/}
        {/*  <>*/}
        {/*    <p>Selected file: {filePath}</p>*/}
        {/*    <button onClick={handleExtractFile}>Extract File</button>*/}
        {/*  </>*/}
        {/*)}*/}
        {/*{message && <p>{message}</p>}*/}
      </div>
    </div>
  );
}

export default App;
