// Core
import React from "react";
import ReactDOM from "react-dom/client";

// Components
import App from "./core/App.jsx";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
