// Core
import cn from "classnames";

// Icons
import { AddIcon, ExtractIcon, RemoveIcon } from "./icons";

// Hooks
import { useDarkMode } from "../../context/DarkModeProvider";

// Styles
import st from "./styles.module.scss";

type MenuPropsType = {
  onSelect: () => void;
  onExtract: () => void;
  onRemove: () => void;
  filePath?: string;
};

export const Menu = (props: MenuPropsType) => {
  const { isDarkMode } = useDarkMode();
  const { onSelect, onExtract, onRemove, filePath = "" } = props;

  const handleSelect = () => {
    onSelect?.();
  };

  const handleExtract = () => {
    onExtract?.();
  };

  const handleRemove = () => {
    onRemove?.();
  };

  const menuStyles = cn(st.menu, {
    [st["menu--dark"]]: isDarkMode,
  });

  return (
    <div className={menuStyles}>
      <div className={st["menu__left"]}>
        <button type={"button"} className={st["menu__button"]} onClick={handleSelect}>
          <span className={st["menu__button-icon"]}>
            <AddIcon />
          </span>
          <span className={st["menu__button-name"]}>Add</span>
        </button>
        <button
          type={"button"}
          className={st["menu__button"]}
          onClick={handleExtract}
          disabled={!filePath}
        >
          <span className={st["menu__button-icon"]}>
            <ExtractIcon />
          </span>
          <span className={st["menu__button-name"]}>Extract</span>
        </button>
      </div>

      <div className={st["menu__right"]}>
        <button
          type={"button"}
          className={st["menu__button"]}
          onClick={handleRemove}
          disabled={!filePath}
        >
          <span className={st["menu__button-icon"]}>
            <RemoveIcon />
          </span>
          <span className={st["menu__button-name"]}>Reset</span>
        </button>
      </div>
    </div>
  );
};
