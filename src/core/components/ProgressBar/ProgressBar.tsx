import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";

export const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");

  useEffect(() => {
    const handleProgress = (
      _: unknown,
      data: {
        processed: number;
        total: number;

        currentFile: string;

        nextFile: string;
      },
    ) => {
      console.log(data, "data");

      const progress = (data.processed / data.total) * 100;

      const progressFixed = Math.round(progress * 100) / 100;

      setCurrentFile(data.currentFile);
      setProgress(progressFixed);

      if (progressFixed === 100) {
        setCurrentFile("");
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
        <span className={st["progress-text"]}>123 {progress}%</span>
      </div>

      {currentFile && <p className={st["current-file"]}>Extracting: {currentFile}</p>}
    </div>
  );
};
