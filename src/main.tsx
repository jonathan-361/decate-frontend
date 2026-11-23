import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRouter from "@/modules/core/routes/Router";
import { ThemeProvider } from "@/modules/core/components/ThemeProvider";
import {
  applyServiceWorkerUpdate,
  registerServiceWorker,
  watchConnectionStatus,
} from "@/modules/core/services/serviceWorker";
import { setUnauthorizedHandler } from "@/modules/core/services/axios.instance";
import { useAuthStore, hydrateAuth } from "@/modules/auth/stores/auth.store";
import { hydrateTheme } from "@/modules/core/stores/theme.store";
import { useSettingsStore } from "@/modules/settings/stores/settings.store";
import "./index.css";

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});

async function bootstrap() {
  // El tema, el usuario y la configuración salen de IndexedDB: se cargan en segundo plano.
  // NO bloqueamos el render con la hidratación de IndexedDB.
  void hydrateTheme();
  void hydrateAuth();
  void useSettingsStore.getState().hydrateSettings();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AppRouter />
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );

  registerServiceWorker({
    onUpdateReady: async () => {
      const { toast } = await import("sonner");
      toast("Hay una versión nueva de Dacate", {
        duration: Infinity,
        action: { label: "Actualizar", onClick: applyServiceWorkerUpdate },
      });
    },
  });
  watchConnectionStatus();
}

void bootstrap();
