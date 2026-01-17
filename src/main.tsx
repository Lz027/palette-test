import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Global error handler for debugging live site
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught:", { message, source, lineno, colno, error });
};

console.log("PALETTE: Application Initializing...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("PALETTE: Root element not found!");
} else {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
