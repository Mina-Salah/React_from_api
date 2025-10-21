import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./locales/i18n.js"; // ربط i18next

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
