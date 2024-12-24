// Core
import React, { useState } from "react";

// Components
import { Toolbar } from "./components/Toolbar";
import { Menu } from "./components/Menu";
import { Path } from "./components/Path";
import { Drop } from "./components/Drop";
import { FileManager } from "./components/FileManager";
import { ProgressBar } from "./components/ProgressBar";
import { PasswordRequired } from "./components/PasswordRequired";

// Hooks
import { useExtractFile } from "./hooks/use-extract-file";

// Constants
import { ERROR_STATUS_CODE } from "../constants/error-status-codes";

// Styles
import "../assets/app.scss";

function App() {
  const { onExtractFile, error, message } = useExtractFile();
  const [filePath, setFilePath] = useState("");

  const handleSelectFile = async () => {
    const filePaths = await window.electronAPI.selectFile();

    if (filePaths.length > 0) {
      setFilePath(filePaths[0]);
    }
  };

  const handleExtractFile = async () => {
    if (!filePath) {
      return;
    }

    onExtractFile({ filePath });
  };

  const handleResetFile = async () => {
    setFilePath("");
  };

  const handleFileDrop = async (path: string) => {
    setFilePath(path);
  };

  const handleClosePasswordRequired = () => {
    // console.log('handleClosePasswordRequired')
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

        {!filePath ? (
          <div className={"app__drop"}>
            <Drop onFileDrop={handleFileDrop} onBrowseFile={handleSelectFile} />
          </div>
        ) : (
          <>
            <div className={"app__filepath"}>
              <Path filePath={filePath} />
            </div>
            <div className={"app__manager"}>
              <FileManager filePath={filePath} />
            </div>
          </>
        )}

        {/*{error && (*/}
        {/*  <div className={"app__error"}>*/}
        {/*    <p>{error}</p>*/}
        {/*  </div>*/}
        {/*)}*/}

        {error === ERROR_STATUS_CODE.PASSWORD_REQUIRED && (
          <PasswordRequired filePath={filePath} onClose={handleClosePasswordRequired} />
        )}

        {/*{message && (*/}
        {/*  <div className={"app__message"}>*/}
        {/*    <p>{message}</p>*/}
        {/*  </div>*/}
        {/*)}*/}

        {/*<ProgressBar />*/}
      </div>
    </div>
  );
}

export default App;
