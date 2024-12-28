// Core
import cn from "classnames";

// Components
import { Modal } from "../Modal";

// Hooks
import { useDarkMode } from "../../../../context/DarkModeProvider";

// Utils
import st from "./styles.module.scss";

type ModalSuccessProps = {
  filePath: string;
  onClose?: () => void;
};

export const ModalSuccess = (props: ModalSuccessProps) => {
  const { onClose, filePath } = props;
  const { isDarkMode } = useDarkMode();

  const handleOpen = () => {
    window.electronAPI.openDirectory(filePath);
  };

  const handleClose = () => {
    onClose?.();
  };

  const modalStyles = cn(st["modal-success"], {
    [st["modal-success--dark"]]: isDarkMode,
  });
  const buttonOpenStyles = cn(st["modal-success__button"], st["modal-success__button--open"]);
  const buttonCloseStyles = cn(st["modal-success__button"], st["modal-success__button--close"]);

  return (
    <Modal onClose={handleClose}>
      <div className={modalStyles}>
        <p className={st["modal-success__message"]}>File extracted successfully</p>
        <input className={st["modal-success__file-path"]} value={filePath} readOnly />
        <div className={st["modal-success__action"]}>
          <button className={buttonOpenStyles} onClick={handleOpen}>
            Open in Finder
          </button>
          <button className={buttonCloseStyles} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
