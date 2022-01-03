import HistoryReader from "./HistoryReader";

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

HistoryReader.prefetch();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.body
);
