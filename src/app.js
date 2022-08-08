import React from "react";
import { createRoot } from "react-dom/client";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import AppRouter from "./routers/AppRouter";

const appRoot = createRoot(document.getElementById("app"));
appRoot.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
