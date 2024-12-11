// Icons
import { AddIcon, ExtractIcon, RemoveIcon } from "./icons";

// Styles
import st from "./styles.module.scss";

type MenuPropsType = {
  onSelect: () => void;
  onExtract: () => void;
  onRemove: () => void;
  filePath?: string;
};

export const Menu = (props: MenuPropsType) => {
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

  return (
    <div className={st.menu}>
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
