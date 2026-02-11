import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

import "./styles/globals.css";
import "./styles/styles.css";

import { I18nProvider } from "./i18n/I18nProvider";
import ErrorBoundary from "./ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <I18nProvider>
          <App />
        </I18nProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
