// Styles
import st from "./styles.module.scss";

type PasswordRequiredSuccessProps = {
  filePath: string;
  onClose?: () => void;
};

export const PasswordRequiredSuccess = (props: PasswordRequiredSuccessProps) => {
  const { onClose, filePath } = props;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className={st["password-required-success"]}>
      <p className={st["password-required-success__message"]}>File extracted successfully</p>
      <input className={st["password-required-success__file-path"]} value={filePath} readOnly />
      <div className={st["password-required-success__action"]}>
        <button className={st["password-required-success__button"]} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};
