// Core
import React from "react";
import ReactDOM from "react-dom/client";

// Components
import App from "./core/App.jsx";

// Contexts
import { DarkModeProvider } from "./core/context/DarkModeProvider";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>,
);
