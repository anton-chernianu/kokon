// Core
import { useState, useCallback } from "react";

// Constants
import { ERROR_STATUS_CODE } from "../../constants/error-status-codes";

// Types
type ExtractFileResultType = {
  status: "success" | "error";
  message: string;
};

type ExtractFileResponse = {
  status: "success" | "error";
  data: {
    errorCode?: string;
    message: string;
  };
};

type UseExtractFileType = {
  error: string;
  message: string;
  isLoading: boolean;
  onExtractFile: (data: { filePath: string; password?: string }) => Promise<ExtractFileResponse>;
};

export const useExtractFile = (): UseExtractFileType => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (errorCode: string, defaultMessage: string): ExtractFileResponse => {
    setError(errorCode);
    return {
      status: "error",
      data: {
        errorCode,
        message: defaultMessage,
      },
    };
  };

  const onExtractFile = useCallback(
    async ({
      filePath,
      password = "",
    }: {
      filePath: string;
      password?: string;
    }): Promise<ExtractFileResponse> => {
      try {
        setIsLoading(true);
        const result: ExtractFileResultType = await window.electronAPI.extractFile({
          filePath,
          password,
        });

        console.log(result, "result");

        if (result.status === "error") {
          switch (result.message) {
            case ERROR_STATUS_CODE.PASSWORD_REQUIRED:
              return handleError(ERROR_STATUS_CODE.PASSWORD_REQUIRED, "Password is required");

            case ERROR_STATUS_CODE.WRONG_PASSWORD:
              return handleError(ERROR_STATUS_CODE.WRONG_PASSWORD, "Wrong password");

            default:
              return handleError(ERROR_STATUS_CODE.UNKNOWN_ERROR, "An unknown error occurred");
          }
        }

        if (result.status === "success") {
          setMessage(result.message);
          return {
            status: "success",
            data: {
              message: result.message,
            },
          };
        }

        return handleError(ERROR_STATUS_CODE.INVALID_RESPONSE, "Invalid response from API");
      } catch (err) {
        console.error("Error in onExtractFile", err);
        return handleError(ERROR_STATUS_CODE.EXCEPTION, "Something went wrong");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    },
    [],
  );

  return {
    error,
    message,
    onExtractFile,
    isLoading,
  };
};
