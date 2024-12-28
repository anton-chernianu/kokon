// Core
import cn from "classnames";

// Hooks
import { useDarkMode } from "../../context/DarkModeProvider";

// Styles
import st from "./styles.module.scss";

type PathPropsType = {
  filePath: string;
};

export const Path = (props: PathPropsType) => {
  const { filePath } = props;

  const { isDarkMode } = useDarkMode();

  const formattedPath = filePath.split("/").map((item, index) => {
    if (index === 0) {
      return item;
    }

    return (
      <span className={st["path__item"]} key={index}>
        <span className={st["path__separator"]}>/</span>
        <span className={st["path__text"]}>{item}</span>
      </span>
    );
  }, []);

  const pathStyles = cn(st.path, {
    [st["path--dark"]]: isDarkMode,
  });

  return (
    <div className={pathStyles}>
      <div className={st["path__text"]}>
        <p>{formattedPath}</p>
      </div>
    </div>
  );
};
