// Core
import { useEffect, type ReactNode } from "react";

// Styles
import st from "./styles.module.scss";

type ModalProps = {
  onClose?: () => void;
  children?: ReactNode;
};

export const Modal = (props: ModalProps) => {
  const { onClose, children } = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className={st["modal"]}>
      <div className={st["modal__overlay"]} onClick={handleClose} />
      <div className={st["modal__container"]}>{children}</div>
    </div>
  );
};
