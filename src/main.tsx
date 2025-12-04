import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { loadConfig } from "./config/config";
import { initializeApi } from "./services/api";
import App from "./App";
import "./styles/index.css";

// Load configuration before rendering the app
loadConfig()
  .then(() => {
    initializeApi();

    createRoot(document.getElementById("app")!).render(
      <StrictMode>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
      </StrictMode>
    );
  })
  .catch((error) => {
    console.error("Failed to initialize application:", error);
  });
