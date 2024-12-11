// Icons
import { AddIcon, ExtractIcon, RemoveIcon } from "./icons";

// Styles
import st from "./styles.module.scss";

type MenuPropsType = {
  onSelect: () => void;
  onExtract: () => void;
  onRemove: () => void;
};

export const Menu = (props: MenuPropsType) => {
  const { onSelect, onExtract, onRemove } = props;

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
        disabled={true}
      >
        <span className={st["menu__button-icon"]}>
          <ExtractIcon />
        </span>
        <span className={st["menu__button-name"]}>Extract</span>
      </button>
      <button type={"button"} className={st["menu__button"]} onClick={handleRemove} disabled={true}>
        <span className={st["menu__button-icon"]}>
          <RemoveIcon />
        </span>
        <span className={st["menu__button-name"]}>Reset</span>
      </button>
    </div>
  );
};
