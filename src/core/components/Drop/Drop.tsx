// Core
import React, { useState, DragEvent } from "react";
import cn from "classnames";

// Icons
import { CloudIcon } from "./icons/cloud";

// Styles
import st from "./styles.module.scss";

type DropPropsType = {
  onFileDrop: (path: string) => void;
};

export const Drop = (props: DropPropsType) => {
  const { onFileDrop } = props;
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

    console.log(e.dataTransfer.files[0], "e");

    const file = e.dataTransfer.files[0];
    const path = await window.electronAPI.startDrag(file);

    console.log(path, "path");


  };

  const handleBrowseFile = () => {
    console.log("test");
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
        <div className={st["drop__title"]}>Drag & Drop to Archive File</div>
        <div className={st["drop__or"]}>or</div>
        <div className={st["drop__action"]}>
          <button className={st["drop__action-button"]} onClick={handleBrowseFile}>
            Browse File
          </button>
        </div>
      </div>
    </div>
  );
};
