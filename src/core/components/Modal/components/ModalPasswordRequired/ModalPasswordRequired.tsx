// Core
import { useState } from "react";

// Components
import { Modal } from "../Modal";
import { PasswordRequiredForm } from "./PasswordRequiredForm";

// Hooks
import { useExtractFile } from "../../../../hooks/use-extract-file";

// Utils
import { ERROR_STATUS_CODE } from "../../../../../constants/error-status-codes";
import { ModalProgress } from "../ModalProgress";

type ModalPasswordRequiredProps = {
  filePath: string;
  onClose?: () => void;
  onSuccess?: (filePath: string) => void;
};

export const ModalPasswordRequired = (props: ModalPasswordRequiredProps) => {
  const { filePath, onClose, onSuccess } = props;

  const { onExtractFile, error, message, isLoading } = useExtractFile();

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
      onSuccess?.(data.message);
    }
  };

  if (isLoading) {
    return <ModalProgress />;
  }

  return (
    <Modal onClose={handleClose}>
      <PasswordRequiredForm
        onSubmit={handleSubmit}
        loading={isLoading}
        errorMessage={errorMessage}
      />
    </Modal>
  );
};
