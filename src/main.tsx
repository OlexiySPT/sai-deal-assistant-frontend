import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import { loadAllEnums } from "./features/enums/enumsSlice";
import App from "./App";
import "./styles/index.css";

// Load enums in the background
store.dispatch(loadAllEnums());

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
