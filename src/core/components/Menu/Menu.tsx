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
        <AddIcon />
      </button>
      <button type={"button"} className={st["menu__button"]} onClick={handleExtract}>
        <ExtractIcon />
      </button>
      <button type={"button"} className={st["menu__button"]} onClick={handleRemove}>
        <RemoveIcon />
      </button>
    </div>
  );
};
