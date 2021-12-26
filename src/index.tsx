import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { initializeIcons } from "@fluentui/font-icons-mdl2";
initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.body
);
