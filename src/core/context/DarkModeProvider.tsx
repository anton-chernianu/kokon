// Core
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const theme = await window.electronAPI.getSystemTheme();
        setIsDarkMode(theme === "dark");
      } catch (e) {
        setIsDarkMode(false);
      }
    })();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  if (isDarkMode === null) {
    return null;
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextProps => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
