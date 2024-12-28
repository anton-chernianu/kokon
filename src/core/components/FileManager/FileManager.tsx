// Core
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import cn from "classnames";

// Hooks
import { useDarkMode } from "../../context/DarkModeProvider";

// Styles
import st from "./styles.module.scss";

// Utils
import { type DirectoryType, FileListTransformer } from "../../utils/format-file-list";
import { fileTypeToEmoji } from "../../utils/file-type-to-emoji";

type FileManagerPropsType = {
  filePath: string;
};

type OpenStateType = {
  [key: string]: boolean;
};

export const FileManager = (props: FileManagerPropsType) => {
  const { filePath } = props;
  const { isDarkMode } = useDarkMode();
  const [directories, setDirectories] = useState<DirectoryType | null>(null);
  const [openState, setOpenState] = useState<OpenStateType>({});

  useEffect(() => {
    (async () => {
      if (filePath) {
        try {
          const { files } = await window.electronAPI.filesList(filePath);
          const transformer = new FileListTransformer();
          const transformedFiles = transformer.transform(files);
          setDirectories(transformedFiles);
          setOpenState(prevState => ({
            ...prevState,
            root: true,
          }));
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [filePath]);

  const toggleDirectory = (path: string) => {
    setOpenState(prevState => ({
      ...prevState,
      [path]: !prevState[path],
    }));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  const renderDirectory = (directory: DirectoryType, path: string) => {
    const isOpen = openState[path] || false;

    return (
      <div key={path} className={st["file-manager__nested"]}>
        <div className={st["file-manager__table-item"]}>
          <div
            className={st["file-manager__table-item-name"]}
            onClick={() => toggleDirectory(path)}
          >
            {isOpen ? "📂" : "📁"} {directory.name}
          </div>
          <div className={st["file-manager__table-item-date"]}>--</div>
          <div className={st["file-manager__table-item-type"]}>Folder</div>
          <div className={st["file-manager__table-item-size"]}>--</div>
        </div>
        {isOpen && (
          <div className={st["file-manager__table-item-sub"]}>
            {directory.files.map((file, index) => (
              <div
                key={`${path}/file-${file.name}-${index}`}
                className={st["file-manager__table-item"]}
              >
                <div className={st["file-manager__table-item-name"]}>
                  {fileTypeToEmoji(file.fileType)}
                  <span>{file.name}</span>
                </div>
                <div className={st["file-manager__table-item-date"]}>{formatDate(file.time)}</div>
                <div className={st["file-manager__table-item-type"]}>{file.fileType}</div>
                <div className={st["file-manager__table-item-size"]}>
                  {formatSize(file.packSize)}
                </div>
              </div>
            ))}
            {directory.directories.map(subDirectory =>
              renderDirectory(subDirectory, `${path}/${subDirectory.name}`),
            )}
          </div>
        )}
      </div>
    );
  };

  if (!directories) {
    return null;
  }

  const fileManagerStyles = cn(st["file-manager"], {
    [st["file-manager--dark"]]: isDarkMode,
  });

  return (
    <div className={fileManagerStyles}>
      <div className={st["file-manager__container"]}>
        <div className={st["file-manager__head"]}>
          <div className={st["file-manager__head-name"]}>Name</div>
          <div className={st["file-manager__head-date"]}>Date Modified</div>
          <div className={st["file-manager__head-type"]}>Type</div>
          <div className={st["file-manager__head-size"]}>Size</div>
        </div>

        <div className={st["file-manager__table"]}>{renderDirectory(directories, "root")}</div>
      </div>
    </div>
  );
};
