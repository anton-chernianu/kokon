// Core
import React from "react";

// Components
import { ModalPasswordRequired } from "../ModalPasswordRequired";
import { ModalSuccess } from "../ModalSuccess";
import { ModalProgress } from "../ModalProgress";

type ModalViewProps = {
  modalType: "PASSWORD_REQUIRED" | "SUCCESS" | "FILE_PROGRESS" | null;
  modalProps: {
    filePath: string;
    extractedToFilePath: string;
    onClose: () => void;
    onSuccess: (filePath: string) => void;
  };
};

export const ModalView = (props: ModalViewProps) => {
  const { modalType, modalProps } = props;

  const { filePath, extractedToFilePath, onClose, onSuccess } = modalProps;

  switch (modalType) {
    case "PASSWORD_REQUIRED":
      return <ModalPasswordRequired filePath={filePath} onClose={onClose} onSuccess={onSuccess} />;

    case "SUCCESS":
      return <ModalSuccess filePath={extractedToFilePath} onClose={onClose} />;

    case "FILE_PROGRESS":
      return <ModalProgress />;

    default:
      return null;
  }
};
