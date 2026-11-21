import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/modules/core/components/ThemeProvider";
import { registerServiceWorker, watchConnectionStatus } from "@/modules/core/services/serviceWorker";
import { setUnauthorizedHandler } from "@/modules/core/services/axios.instance";
import { useAuthStore, hydrateAuth } from "@/modules/auth/stores/auth.store";
import { hydrateTheme } from "@/modules/core/stores/theme.store";
import "./index.css";

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});

const App = lazy(() => import("@/modules/core/routes/Router"));

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

async function bootstrap() {
  // El tema y el usuario salen de IndexedDB: se cargan en segundo plano.
  // Usar Promise.race para evitar bloqueos si la carga de IndexedDB tarda demasiado.
  await Promise.race([
    Promise.all([hydrateTheme(), hydrateAuth()]),
    new Promise(resolve => setTimeout(resolve, 3000))
  ]);

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <Suspense fallback={<LoadingScreen />}>
            <App />
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );

  registerServiceWorker();
  watchConnectionStatus();
}

void bootstrap();
