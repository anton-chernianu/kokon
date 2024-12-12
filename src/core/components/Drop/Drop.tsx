// Core
import React, { useState, DragEvent } from "react";
import cn from "classnames";

// Icons
import { CloudIcon } from "./icons/cloud";

// Styles
import st from "./styles.module.scss";

type DropPropsType = {
  onFileDrop: (path: string) => void;
  onBrowseFile?: () => void;
};

export const Drop = (props: DropPropsType) => {
  const { onFileDrop, onBrowseFile } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setError("");
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (!file) {
      console.log("No file found");
      setError("No file found");
      return;
    }

    const fileTypeXRar = "application/x-rar";
    const fileTypeXRarCompressed = "application/x-rar-compressed";

    const { path, type } = await window.electronAPI.startDrag(file);

    if (type !== fileTypeXRarCompressed && type !== fileTypeXRar) {
      setError("Only RAR files are supported");
      return;
    }

    onFileDrop?.(path);
    setError("");
  };

  const handleBrowseFile = () => {
    onBrowseFile?.();
  };

  const dropClasses = cn(st.drop, {
    [st["drop--dragging"]]: isDragging,
    [st["drop--error"]]: error,
  });

  return (
    <div
      className={dropClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={st["drop__container"]}>
        <div className={st["drop__icon"]}>
          <CloudIcon />
        </div>
        <div className={st["drop__title"]}>Drag & Drop to RAR File</div>
        <div className={st["drop__or"]}>or</div>
        <div className={st["drop__action"]}>
          <button className={st["drop__action-button"]} onClick={handleBrowseFile}>
            Browse File
          </button>

          {error && <div className={st["drop__error"]}>{error}</div>}
        </div>
      </div>
    </div>
  );
};
