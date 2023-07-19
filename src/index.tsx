import HistoryReader from "./HistoryReader";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

HistoryReader.prefetch();

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
