import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { MyProvider } from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MyProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MyProvider>
  </StrictMode>
);
