// Core
import React from "react";
import cn from "classnames";

// Hooks
import { useDarkMode } from "../../context/DarkModeProvider";

// Styles
import st from "./styles.module.scss";

type SettingsPropsType = {
  onBack?: () => void;
};

export const Settings = (props: SettingsPropsType) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { onBack } = props;

  const handleBackClick = () => {
    onBack?.();
  };

  const settingsStyles = cn(st.settings, {
    [st["settings--dark"]]: isDarkMode,
  });

  const switchStyles = cn(st.switch, {
    [st["switch--active"]]: isDarkMode,
  });

  return (
    <div className={settingsStyles}>
      <div className={st.settings__header}>
        <button type="button" className={st.settings__back} onClick={handleBackClick}>
          ← Go Back
        </button>
        <h2 className={st.settings__title}>Settings</h2>
      </div>

      <div className={st.settings__content}>
        <div className={st.settings__item}>
          <div className={st.settings__label}>
            <span className={st.settings__labelText}>Switch theme</span>
            <span className={st.settings__labelDesc}>
              {isDarkMode ? "Dark Theme" : "Light theme"}
            </span>
          </div>

          <button type="button" className={switchStyles} onClick={toggleDarkMode}>
            <div className={st.switch__thumb} />
          </button>
        </div>
      </div>
    </div>
  );
};
