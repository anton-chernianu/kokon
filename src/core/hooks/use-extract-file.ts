// Core
import { useState, useCallback } from "react";

// Constants
import { ERROR_STATUS_CODE } from "../../constants/error-status-codes";

type ExtractFileResultType = {
  status: string;
  message: string;
};

type UseExtractFileType = {
  error: string;
  message: string;
  onExtractFile: (data: { filePath: string; password?: string }) => void;
};

export const useExtractFile = (): UseExtractFileType => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onExtractFile = useCallback(
    async (data: { filePath: string; password?: string }) => {
      const { filePath, password = "" } = data;

      try {
        const result: ExtractFileResultType = await window.electronAPI.extractFile({
          filePath,
          password,
        });

        if (result.status === "error") {
          if (result.message === ERROR_STATUS_CODE.PASSWORD_REQUIRED) {
            setError(ERROR_STATUS_CODE.PASSWORD_REQUIRED);
          }
          return;
        }

        if (result.status === "success") {
          setMessage(result.message);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [error, message],
  );

  return {
    error,
    message,
    onExtractFile,
  };
};
