import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");

  useEffect(() => {
    const handleProgress = (_, data) => {
      console.log(data, "data");

      if (data?.progress !== undefined && !isNaN(data.progress)) {
        setProgress(data.progress);
      }
      if (data?.currentFile) {
        setCurrentFile(data.currentFile);
      }
    };

    window.electronAPI.on("extract-progress", handleProgress);

    return () => {
      window.electronAPI.removeListener("extract-progress", handleProgress);
    };
  }, []);

  return (
    <div className={st["progress-container"]}>
      <div className={st["progress-bar"]} style={{ width: `${progress}%` }}>
        <span className={st["progress-text"]}>{progress}%</span>
      </div>
      {currentFile && <p className={st["current-file"]}>Extracting: {currentFile}</p>}
    </div>
  );
};
