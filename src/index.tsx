import HistoryReader from "./HistoryReader";

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import type {} from "react-dom/experimental";

HistoryReader.prefetch();

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
