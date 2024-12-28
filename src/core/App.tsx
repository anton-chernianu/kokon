// Core
import React, { useCallback, useEffect, useState } from "react";
import cn from "classnames";

// Components
import { Toolbar } from "./components/Toolbar";
import { Menu } from "./components/Menu";
import { Path } from "./components/Path";
import { Drop } from "./components/Drop";
import { FileManager } from "./components/FileManager";
import { ModalView } from "./components/Modal";

// Hooks
import { useExtractFile } from "./hooks/use-extract-file";
import { useDarkMode } from "./context/DarkModeProvider";

// Constants
import { ERROR_STATUS_CODE } from "../constants/error-status-codes";

// Styles
import "@/assets/styles/app.scss";

type FileStateType = {
  filePath: string;
  extractedToFilePath: string;
  isPasswordRequired: boolean;
  isSuccess: boolean;
};

const INITIAL_FILE_STATE: FileStateType = {
  filePath: "",
  extractedToFilePath: "",
  isPasswordRequired: false,
  isSuccess: false,
};

function App() {
  const { isDarkMode } = useDarkMode();
  const { onExtractFile, isLoading } = useExtractFile();
  const [fileState, setFileState] = useState<FileStateType>(INITIAL_FILE_STATE);
  const [modalType, setModalType] = useState<
    "PASSWORD_REQUIRED" | "SUCCESS" | "FILE_PROGRESS" | null
  >(null);

  const updateFileState = useCallback(
    (updates: Partial<FileStateType>) => setFileState(prevState => ({ ...prevState, ...updates })),
    [],
  );

  const handleSelectFile = async () => {
    const filePaths = await window.electronAPI.selectFile();

    if (filePaths.length > 0) {
      updateFileState({ filePath: filePaths[0] });
    }
  };

  const handleExtractFile = async () => {
    const { filePath } = fileState;

    if (!filePath) {
      return;
    }

    try {
      const { status, data } = await onExtractFile({ filePath });
      const { errorCode, message } = data;

      if (status === "error" && errorCode === ERROR_STATUS_CODE.PASSWORD_REQUIRED) {
        setModalType("PASSWORD_REQUIRED");
        updateFileState({ isPasswordRequired: true });
        return;
      }

      if (status === "success") {
        handleSuccess(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetFile = async () => {
    updateFileState(INITIAL_FILE_STATE);
  };

  const handleFileDrop = async (path: string) => {
    updateFileState({ filePath: path });
  };

  const handleSuccess = (filePath: string) => {
    setModalType("SUCCESS");
    updateFileState({ isSuccess: true, extractedToFilePath: filePath });
  };

  const handleModalClose = () => {
    updateFileState({ isPasswordRequired: false, isSuccess: false });
    setModalType(null);
  };

  const appStyles = cn("app", {
    "app--dark": isDarkMode,
  });

  return (
    <div className={appStyles}>
      <div className={"app__toolbar"}>
        <Toolbar />
      </div>
      <div className={"app__content"}>
        <div className={"app__menu"}>
          <Menu
            onSelect={handleSelectFile}
            onExtract={handleExtractFile}
            onRemove={handleResetFile}
            filePath={fileState.filePath}
          />
        </div>

        {!fileState.filePath ? (
          <div className={"app__drop"}>
            <Drop onFileDrop={handleFileDrop} onBrowseFile={handleSelectFile} />
          </div>
        ) : (
          <>
            <div className={"app__filepath"}>
              <Path filePath={fileState.filePath} />
            </div>
            <div className={"app__manager"}>
              <FileManager filePath={fileState.filePath} />
            </div>
          </>
        )}

        <ModalView
          modalType={isLoading ? "FILE_PROGRESS" : modalType}
          modalProps={{
            filePath: fileState.filePath,
            extractedToFilePath: fileState.extractedToFilePath,
            onClose: handleModalClose,
            onSuccess: handleSuccess,
          }}
        />
      </div>
    </div>
  );
}

export default App;
