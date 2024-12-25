// Styles
import st from "./styles.module.scss";

export const Loader = () => {
  return (
    <div className={st["loader"]}>
      <div className={st["loader__circle"]} />
    </div>
  );
};
