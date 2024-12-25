// Components
import { Modal } from "../Modal";

// Utils
import st from "./styles.module.scss";

type ModalSuccessProps = {
  filePath: string;
  onClose?: () => void;
};

export const ModalSuccess = (props: ModalSuccessProps) => {
  const { onClose, filePath } = props;

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={st["modal-success"]}>
        <p className={st["modal-success__message"]}>File extracted successfully</p>
        <input className={st["modal-success__file-path"]} value={filePath} readOnly />
        <div className={st["modal-success__action"]}>
          <button className={st["modal-success__button"]} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
