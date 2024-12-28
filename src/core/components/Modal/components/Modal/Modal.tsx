// Core
import { useEffect, type ReactNode } from "react";
import cn from "classnames";

// Hooks
import { useDarkMode } from "../../../../context/DarkModeProvider";

// Styles
import st from "./styles.module.scss";

type ModalProps = {
  onClose?: () => void;
  children?: ReactNode;
};

export const Modal = (props: ModalProps) => {
  const { onClose, children } = props;

  const { isDarkMode } = useDarkMode();

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

  const modalStyles = cn(st.modal, {
    [st["modal--dark"]]: isDarkMode,
  });

  return (
    <div className={modalStyles}>
      <div className={st["modal__overlay"]} onClick={handleClose} />
      <div className={st["modal__container"]}>{children}</div>
    </div>
  );
};
