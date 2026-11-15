import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRouter from "@/modules/core/routes/Router";
import { ThemeProvider } from "@/modules/core/components/ThemeProvider";
import { registerServiceWorker, watchConnectionStatus } from "@/modules/core/services/serviceWorker";
import { setUnauthorizedHandler } from "@/modules/core/services/axios.instance";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import "./index.css";

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

registerServiceWorker();
watchConnectionStatus();
