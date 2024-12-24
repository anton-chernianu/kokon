// Core
import { useEffect, useState } from "react";

// Styles
import st from "./styles.module.scss";
import { useExtractFile } from "../../hooks/use-extract-file";
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

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    console.log("handleClose");
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    setErrorMessage("");

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
    <div className={st["password-required"]}>
      <div className={st["password-required__overlay"]} onClick={handleClose} />
      <div className={st["password-required__container"]}>
        {isLoading && (
          <div className={st["password-required__loader"]}>
            <div className={st["password-required__loading-circle"]}></div>
          </div>
        )}

        {isSuccess && (
          <div className={st["password-required__success"]}>
            <p className={st["password-required__success-message"]}>File extracted successfully</p>
            <input
              className={st["password-required__success-file-path"]}
              value={savedFilePath}
              readOnly
            />
            <div className={st["password-required__success-action"]}>
              <button className={st["password-required__button"]} onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        )}

        {!isSuccess && (
          <div className={st["password-required__content"]}>
            <p className={st["password-required__description"]}>
              This file is password protected. <br /> Please enter the password to extract the
              contents.
            </p>
            <div className={st["password-required__field"]}>
              {/*TODO: add show/hide password component*/}
              <input
                className={st["password-required__input"]}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className={st["password-required__error"]}>{errorMessage}</span>
            </div>

            <button
              className={st["password-required__button"]}
              onClick={handleSubmit}
              disabled={isLoading || !password}
            >
              Extract
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
