import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// CSS
import "./index.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/button.css";
import "./styles/login.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
