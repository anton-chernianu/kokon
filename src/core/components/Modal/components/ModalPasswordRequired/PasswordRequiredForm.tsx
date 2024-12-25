// Core
import { useEffect, useRef, useState } from "react";

// Styles
import st from "./styles.module.scss";

type PasswordRequiredFormProps = {
  loading: boolean;
  onSubmit: (data: { password: string }) => void;
  errorMessage?: string;
};

export const PasswordRequiredForm = (props: PasswordRequiredFormProps) => {
  const { onSubmit, loading, errorMessage = "" } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = async () => {
    onSubmit?.({ password });
  };

  return (
    <div className={st["password-required-form"]}>
      <div className={st["password-required-form__content"]}>
        <p className={st["password-required-form__description"]}>
          This file is password protected. <br /> Please enter the password to extract the contents.
        </p>
        <div className={st["password-required-form__field"]}>
          {/*TODO: add show/hide password component*/}
          <input
            ref={inputRef}
            className={st["password-required-form__input"]}
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <span className={st["password-required-form__error"]}>{error}</span>
        </div>
        <button
          className={st["password-required-form__button"]}
          onClick={handleSubmit}
          disabled={loading || !password}
        >
          Extract
        </button>
      </div>
    </div>
  );
};
