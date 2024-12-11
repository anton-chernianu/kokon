// Core
import React, { useState } from "react";

// Components
import { Toolbar } from "./components/Toolbar";
import { Menu } from "./components/Menu";
import { Drop } from "./components/Drop";
import { Path } from "./components/Path";
import { FileManager } from "./components/FileManager";

// Styles
import "../assets/app.scss";

function App() {
  const [filePath, setFilePath] = useState("");
  const [message, setMessage] = useState("");

  const handleSelectFile = async () => {
    const filePaths = await window.electronAPI.selectFile();

    if (filePaths.length > 0) {
      setFilePath(filePaths[0]);
    }
  };

  const handleExtractFile = async () => {
    if (filePath) {
      const result = await window.electronAPI.extractFile(filePath);
      setMessage(result);
    }
  };

  const handleResetFile = async () => {
    setFilePath("");
  };

  const handleFileDrop = async (path: string) => {
    setFilePath(path);
  };

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
            onRemove={handleResetFile}
            filePath={filePath}
          />
        </div>

        {!filePath && (
          <div className={"app__drop"}>
            <Drop onFileDrop={handleFileDrop} onBrowseFile={handleSelectFile} />
          </div>
        )}

        {filePath && (
          <>
            <div className={"app__filepath"}>
              <Path filePath={filePath} />
            </div>
            <div className={"app__manager"}>
              <FileManager filePath={filePath} />
            </div>
          </>
        )}

        {message && (
          <div className={"app__message"}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
