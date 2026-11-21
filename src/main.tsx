import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRouter from "@/modules/core/routes/Router";
import { ThemeProvider } from "@/modules/core/components/ThemeProvider";
import { registerServiceWorker, watchConnectionStatus } from "@/modules/core/services/serviceWorker";
import { setUnauthorizedHandler } from "@/modules/core/services/axios.instance";
import { useAuthStore, hydrateAuth } from "@/modules/auth/stores/auth.store";
import { hydrateTheme } from "@/modules/core/stores/theme.store";
import "./index.css";

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});

async function bootstrap() {
  // El tema y el usuario salen de IndexedDB: se cargan antes de montar la app.
  await Promise.all([hydrateTheme(), hydrateAuth()]);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );

  registerServiceWorker();
  watchConnectionStatus();
}

void bootstrap();
