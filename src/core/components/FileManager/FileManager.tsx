// Styles
import st from "./styles.module.scss";

type FileManagerPropsType = {
  filePath: string;
};

export const FileManager = (props: FileManagerPropsType) => {
  const { filePath } = props;

  return (
    <div className={st['file-manager']}>
      <div className={st["file-manager__container"]}>
        File Viewer
      </div>
    </div>
  );
};
