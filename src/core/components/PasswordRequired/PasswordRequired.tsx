// Core
import { useState } from "react";

// Components
import { Modal } from "../Modal";
import { Loader } from "../Loader";
import { PasswordRequiredForm } from "./PasswordRequiredForm";
import { PasswordRequiredSuccess } from "./PasswordRequiredSuccess";

// Hooks
import { useExtractFile } from "../../hooks/use-extract-file";

// Utils
import { ERROR_STATUS_CODE } from "../../../constants/error-status-codes";

type PasswordRequiredProps = {
  filePath: string;
  onClose?: () => void;
};

export const PasswordRequired = (props: PasswordRequiredProps) => {
  const { onClose, filePath } = props;

  const { onExtractFile, error, message, isLoading } = useExtractFile();

  const [isSuccess, setIsSuccess] = useState(false);
  const [savedFilePath, setSavedFilePath] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    onClose?.();
    setErrorMessage("");
  };

  const handleSubmit = async (formData: { password: string }) => {
    const { password } = formData;

    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    const { status, data } = await onExtractFile({ filePath, password });

    if (status === "error" && data.errorCode === ERROR_STATUS_CODE.WRONG_PASSWORD) {
      setErrorMessage(data.message);
      return;
    }

    if (status === "success") {
      setIsSuccess(true);
      setSavedFilePath(data.message);
    }
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <Loader />}

      {!isSuccess ? (
        <PasswordRequiredForm
          onSubmit={handleSubmit}
          loading={isLoading}
          errorMessage={errorMessage}
        />
      ) : (
        <PasswordRequiredSuccess filePath={savedFilePath} onClose={handleClose} />
      )}
    </Modal>
  );
};
